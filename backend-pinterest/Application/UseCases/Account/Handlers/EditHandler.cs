using Application.Common.Exceptions;
using Application.Interfaces;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Account.Handlers;

public class EditHandler(
    IImageService imageService,
    IJwtTokenService tokenService,
    IAccountRepository accountRepository) : IRequestHandler<EditCommand, TokenDTO>
{
    public async Task<TokenDTO> Handle(EditCommand request, CancellationToken cancellationToken)
    {
        var user = await accountRepository.GetByIdAsync(request.Id, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("Користувача не знайдено");
        }

        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;
        user.Email = request.Email ?? user.Email;
        user.Bio = request.Bio ?? user.Bio;
        user.IsPrivate = request.IsPrivate ?? user.IsPrivate;
        user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;

        if (request.ImageFile != null)
            user.Image = await imageService.SaveImageAsync(request.ImageFile);

        var result = await accountRepository.EditAsync(user, cancellationToken);

        return await tokenService.CreateTokenAsync(result);
    }
}
