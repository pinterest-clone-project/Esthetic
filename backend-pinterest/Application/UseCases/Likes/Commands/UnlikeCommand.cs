using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Likes.Commands;

public class UnlikeCommand : IRequest<Unit>
{
    [BindNever]
    public Guid UserId { get; init; }
    public Guid PinId { get; init; }
}