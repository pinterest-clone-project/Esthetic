using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Interfaces;
using Application.Models.DTO;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using AutoMapper;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Application.UseCases.Account.Handlers;

public class GoogleCommandHandler(
    UserManager<UserEntity> userManager,
    IJwtTokenService tokenService,
    IMapper mapper,
    IConfiguration configuration,
    IImageService imageService)
    : IRequestHandler<GoogleCommand, TokenDTO>
{
    public async Task<TokenDTO> Handle(
        GoogleCommand request,
        CancellationToken cancellationToken)
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
            var userLoginGoogle = await userManager
                .FindByLoginAsync("Google", googleUser.GogoleId);

            if (userLoginGoogle == null)
            {
                await userManager.AddLoginAsync(existingUser,
                    new UserLoginInfo("Google", googleUser.GogoleId, "Google"));
            }

            return await tokenService.CreateTokenAsync(existingUser);
        }

        var user = mapper.Map<UserEntity>(googleUser);
        user.EmailConfirmed = true;

        if (!string.IsNullOrEmpty(googleUser.Picture))
        {
            user.Image = await imageService.SaveImageFromUrlAsync(googleUser.Picture);
        }

        var result = await userManager.CreateAsync(user);

        if (!result.Succeeded)
            throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        await userManager.AddLoginAsync(user,
            new UserLoginInfo("Google", googleUser.GogoleId, "Google"));

        await userManager.AddToRoleAsync(user, "User");

        return await tokenService.CreateTokenAsync(user);
    }
}