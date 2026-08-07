using Application.Models.DTO.BoardSection;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.BoardSections.Commands;

public class UpdateBoardSectionCommand : IRequest<BoardSectionDTO>
{
    [BindNever]
    public Guid Id { get; init; }
    public string? Title { get; init; }

    [BindNever]
    public Guid OwnerId { get; set; }
}
