using Application.Models.DTO.Pin;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Pins.Commands;

public record CreatePinCommand : IRequest<PinDTO>
{
    [FromForm]
    public IFormFile? ImageFile { get; init; }

    public string? MediaUrl { get; init; }
    public string? Title { get; init; }
    public string? Description { get; init; }
    public string? SourceUrl { get; init; }
    public Guid? CategoryId { get; init; }
    public List<Guid>? TagIds { get; init; }
    [BindNever]
    public Guid CreatorId { get; init; }
}
