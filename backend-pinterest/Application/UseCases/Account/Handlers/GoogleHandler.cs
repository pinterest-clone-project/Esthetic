using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using Domain.Constants;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Application.UseCases.Account.Handlers;

public class GoogleCommandHandler(
    UserManager<UserEntity> userManager,
    RoleManager<RoleEntity> roleManager,
    IJwtTokenService tokenService,
    UserMapper userMapper,
    IConfiguration configuration,
    IImageService imageService) : IRequestHandler<GoogleCommand, TokenDTO>
{
    public async Task<TokenDTO> Handle(GoogleCommand request, CancellationToken cancellationToken)
    {
        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", request.Token);

        var userInfoUrl = configuration["GoogleUserInfo"]
            ?? "https://www.googleapis.com/oauth2/v2/userinfo";

        var response = await httpClient.GetAsync(userInfoUrl, cancellationToken);
        if (!response.IsSuccessStatusCode)
            throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        var googleUser = JsonSerializer.Deserialize<GoogleAccountModel>(json)
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var existingUser = await userManager.FindByEmailAsync(googleUser.Email);

        if (existingUser != null)
        {
            var userLogins = await userManager.GetLoginsAsync(existingUser);
            var hasGoogleLogin = userLogins.Any(l => l.LoginProvider == "Google" && l.ProviderKey == googleUser.GogoleId);

            if (!hasGoogleLogin)
            {
                var addLoginResult = await userManager.AddLoginAsync(existingUser,
                    new UserLoginInfo("Google", googleUser.GogoleId, "Google"));

                if (!addLoginResult.Succeeded)
                    throw new BadRequestException(ValidationMessages.GoogleLinkFailed);
            }

            return await tokenService.CreateTokenAsync(existingUser);
        }

        var user = userMapper.ToEntity(googleUser);
        user.EmailConfirmed = true;

        if (!string.IsNullOrEmpty(googleUser.Picture))
            user.Image = await imageService.SaveImageFromUrlAsync(googleUser.Picture);

        var createResult = await userManager.CreateAsync(user);
        if (!createResult.Succeeded)
            throw new BadRequestException(string.Join(", ", createResult.Errors.Select(e => e.Description)));

        var loginResult = await userManager.AddLoginAsync(user,
            new UserLoginInfo("Google", googleUser.GogoleId, "Google"));

        if (!loginResult.Succeeded)
            throw new BadRequestException(ValidationMessages.ExternalLoginLinkFailed);

        if (!await roleManager.RoleExistsAsync(Roles.User))
            await roleManager.CreateAsync(new RoleEntity { Name = Roles.User });

        await userManager.AddToRoleAsync(user, Roles.User);

        return await tokenService.CreateTokenAsync(user);
    }
}