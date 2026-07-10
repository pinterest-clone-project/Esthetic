using Application.Common.Exceptions;
using Application.Common.Resources;
using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using Domain.Constants;
using Domain.Entities;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.UseCases.Account.Handlers;

public class RegisterHandler(
    UserManager<UserEntity> userManager,
    RoleManager<RoleEntity> roleManager,
    UserMapper userMapper,
    IJwtTokenService tokenService,
    IImageService imageService, 
    IUserCategoryRepository userCategoryRepository) : IRequestHandler<RegisterCommand, TokenDTO>
{
    public async Task<TokenDTO> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await userManager.FindByEmailAsync(request.Email);

        if (existingUser != null)
        {
            var hasPassword = await userManager.HasPasswordAsync(existingUser);

            if (hasPassword)
            {
                throw new BadRequestException(ValidationMessages.EmailAlreadyExists);
            }

            var addPasswordResult = await userManager.AddPasswordAsync(existingUser, request.Password);

            if (!addPasswordResult.Succeeded)
                throw new BadRequestException(string.Join(", ", addPasswordResult.Errors.Select(e => e.Description)));

            existingUser.Country = request.Country;
            existingUser.Language = request.Language;

            if (request.ImageFile != null)
                existingUser.Image = await imageService.SaveImageAsync(request.ImageFile);

            await userManager.UpdateAsync(existingUser);
            await AddUserCategoriesAsync(existingUser.Id, request.CategoryIds, cancellationToken);

            return await tokenService.CreateTokenAsync(existingUser);
        }

        var user = userMapper.ToEntity(request);

        if (request.ImageFile != null)
            user.Image = await imageService.SaveImageAsync(request.ImageFile);

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
            throw new BadRequestException(string.Join(", ", createResult.Errors.Select(e => e.Description)));

        if (!await roleManager.RoleExistsAsync(Roles.User))
            await roleManager.CreateAsync(new RoleEntity { Name = Roles.User });

        await userManager.AddToRoleAsync(user, Roles.User);
        await AddUserCategoriesAsync(user.Id, request.CategoryIds, cancellationToken);

        return await tokenService.CreateTokenAsync(user);
    }

    private async Task AddUserCategoriesAsync(Guid userId, IList<Guid>? categoryIds, CancellationToken cancellationToken)
    {
        if (categoryIds is not { Count: > 0 })
            return;

        var userCategories = categoryIds
            .Distinct()
            .Select(categoryId => new UserCategory { UserId = userId, CategoryId = categoryId });

        await userCategoryRepository.AddRangeAsync(userCategories, cancellationToken);
    }
}