using Application.Common.Exceptions;
using Application.Common.Validators;
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
            throw new NotFoundException(ValidationMessages.UserNotFound);
        }

        user.FirstName = request.FirstName.Apply(user.FirstName);
        user.LastName = request.LastName.Apply(user.LastName);
        user.Email = request.Email.Apply(user.Email);
        user.Bio = request.Bio.Apply(user.Bio);
        user.PhoneNumber = request.PhoneNumber.Apply(user.PhoneNumber);

        user.IsPrivate = request.IsPrivate ?? user.IsPrivate;
        user.Gender = request.Gender ?? user.Gender;
        user.BirthDate = request.BirthDate ?? user.BirthDate;

        if (request.ImageFile != null)
            user.Image = await imageService.SaveImageAsync(request.ImageFile);

        var result = await accountRepository.EditAsync(user, cancellationToken);

        return await tokenService.CreateTokenAsync(result);
    }
}
