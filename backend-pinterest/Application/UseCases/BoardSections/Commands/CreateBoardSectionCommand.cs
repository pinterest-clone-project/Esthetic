

using Application.Models.DTO.BoardSection;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.BoardSections.Commands;

public class CreateBoardSectionCommand : IRequest<BoardSectionDTO>
{
    public Guid BoardId { get; init; }
    public required string Title { get; init; }

    [BindNever]
    public Guid OwnerId { get; init; }
}
