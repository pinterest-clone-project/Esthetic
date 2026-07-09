using Application.Models.DTO.Board;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.UseCases.Boards.Commands;

public record CreateBoardCommand : IRequest<BoardDTO>
{
    public required string Title { get; init; }
    public string? Description { get; init; }
    public bool IsPrivate { get; init; }
    public List<Guid>? PinIds { get; init; }

    [BindNever]
    public Guid OwnerId { get; init; }
}
