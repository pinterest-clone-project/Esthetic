
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.BoardSections.Commands;

public class DeleteBoardSectionCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
    [BindNever]
    public Guid OwnerId { get; init; }
}
