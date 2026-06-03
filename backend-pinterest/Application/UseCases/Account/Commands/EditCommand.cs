using Application.Common.Optional;
using Application.Interfaces.Transaction;
using Application.Models.DTO.User;
using MediatR;
using Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Account.Commands;

public record EditCommand : IRequest<string>, ITransactionalCommand
{
    [BindNever]
    public Guid Id { get; init; }
    public Optional<string> FirstName { get; init; }
    public Optional<string> LastName { get; init; }
    public Optional<string> Email { get; init; }
    public Optional<string> Bio { get; init; }
    public Optional<string> PhoneNumber { get; init; }
    public Gender? Gender { get; init; }
    public DateTime? BirthDate { get; set; }
    public bool? IsPrivate { get; init; }

    [FromForm]
    public IFormFile? ImageFile { get; init; }
}
