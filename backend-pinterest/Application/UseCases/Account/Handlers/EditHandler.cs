using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Interfaces;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Account.Handlers;

public class EditHandler(
    IImageService imageService,
    IJwtTokenService tokenService,
    IAccountRepository accountRepository,
    IUserCategoryRepository userCategoryRepository) : IRequestHandler<EditCommand, string>
{
    public async Task<string> Handle(EditCommand request, CancellationToken cancellationToken)
    {
        var user = await accountRepository.GetByIdAsync(request.Id, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException(ValidationMessages.UserNotFound);
        }

        if (request.UserName.HasValue && !request.UserName.IsCleared)
        {
            var taken = await accountRepository.IsUserNameTakenAsync(request.UserName.Value!, user.Id, cancellationToken);
            if (taken)
                throw new ConflictException(ValidationMessages.UserNameAlreadyTaken);
        }

        user.FirstName = request.FirstName.Apply(user.FirstName);
        user.LastName = request.LastName.Apply(user.LastName);
        user.UserName = request.UserName.Apply(user.UserName);
        user.Email = request.Email.Apply(user.Email);
        user.Bio = request.Bio.Apply(user.Bio);
        user.PhoneNumber = request.PhoneNumber.Apply(user.PhoneNumber);
        user.Country = request.Country.Apply(user.Country);
        user.Language = request.Language.Apply(user.Language);

        user.IsPrivate = request.IsPrivate ?? user.IsPrivate;
        user.Gender = request.Gender ?? user.Gender;
        user.BirthDate = request.BirthDate.HasValue
            ? DateTime.SpecifyKind(request.BirthDate.Value, DateTimeKind.Utc)
            : user.BirthDate;

        if (request.ImageFile != null)
            user.Image = await imageService.SaveImageAsync(request.ImageFile);

        if (request.CategoryIds.IsCleared)
        {
            await SyncUserCategoriesAsync(user.Id, [], cancellationToken);
        }
        else if (request.CategoryIds.HasValue)
        {
            await SyncUserCategoriesAsync(user.Id, request.CategoryIds.Value ?? [], cancellationToken);
        }

        var result = await accountRepository.EditAsync(user, cancellationToken);

        return await tokenService.CreateAccessTokenOnlyAsync(result);
    }

    private async Task SyncUserCategoriesAsync(Guid userId, List<Guid> categoryIds, CancellationToken cancellationToken)
    {
        var existing = await userCategoryRepository.GetAllByUserAsync(userId, cancellationToken);
        var newIds = categoryIds.Distinct().ToHashSet();

        var toRemove = existing.Where(uc => !newIds.Contains(uc.CategoryId)).ToList();
        var existingIds = existing.Select(uc => uc.CategoryId).ToHashSet();
        var toAdd = newIds
            .Where(id => !existingIds.Contains(id))
            .Select(id => new UserCategory { UserId = userId, CategoryId = id })
            .ToList();

        if (toRemove.Count > 0)
            await userCategoryRepository.RemoveRangeAsync(toRemove, cancellationToken);

        if (toAdd.Count > 0)
            await userCategoryRepository.AddRangeAsync(toAdd, cancellationToken);
    }
}