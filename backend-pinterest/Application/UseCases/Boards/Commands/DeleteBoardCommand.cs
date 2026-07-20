using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Boards.Commands;

public record DeleteBoardCommand : IRequest<Unit>
{
    public Guid Id { get; init; }

    [BindNever]
    public Guid OwnerId { get; init; }
    [BindNever]
    public bool SkipOwnerValidation { get; init; }
}
