using Application.Models.DTO.Board;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Boards.Commands;

public record UpdateBoardCommand : IRequest<BoardDTO>
{
    [BindNever]
    public Guid Id { get; init; }

    public string? Title { get; init; }
    public string? Description { get; init; }
    public bool? IsPrivate { get; init; }

    [FromForm]
    public IFormFile? CoverImageFile { get; init; }

    [BindNever]
    public Guid OwnerId { get; init; }
}