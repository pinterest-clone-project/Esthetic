using Application.UseCases.Likes.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Likes.Handlers;

public class UnlikeHandler(ILikeRepository likeRepository) : IRequestHandler<UnlikeCommand, Unit>
{
    public async Task<Unit> Handle(UnlikeCommand request, CancellationToken cancellationToken)
    {
        await likeRepository.UnlikeAsync(request.UserId, request.PinId, cancellationToken);
        return Unit.Value;
    }
}