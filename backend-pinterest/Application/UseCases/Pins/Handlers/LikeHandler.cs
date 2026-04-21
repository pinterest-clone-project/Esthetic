using Application.UseCases.Pins.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class LikeHandler(ILikeRepository likeRepository) : IRequestHandler<LikeCommand, Unit>
{
    public async Task<Unit> Handle(LikeCommand request, CancellationToken cancellationToken)
    {
        await likeRepository.LikeAsync(request.UserId, request.PinId, cancellationToken);
        return Unit.Value;
    }
}