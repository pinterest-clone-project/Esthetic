using Application.Exceptions;
using Application.Interfaces;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using AutoMapper;
using Domain.Entities.Identity;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.UseCases.Account.Handlers;

public class EditHandler(
    IImageService imageService,
    IJwtTokenService tokenService,
    UserManager<UserEntity> userManager) : IRequestHandler<EditCommand, TokenDTO>
{
    public async Task<TokenDTO> Handle(EditCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(request.Id.ToString());

        if (user == null)
        {
            var failures = new List<ValidationFailure> { new ValidationFailure("Edit", "User was not found.") };

            throw new ValidationException(failures);
        }

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;
        user.Bio = request.Bio;

        if (request.ImageFile != null)
            user.Image = await imageService.SaveImageAsync(request.ImageFile);

        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            var failures = result.Errors
                .Select(e => new ValidationFailure("Edit", e.Description))
                .ToList();

            throw new ValidationException(failures);
        }

        return await tokenService.CreateTokenAsync(user);
    }
}
