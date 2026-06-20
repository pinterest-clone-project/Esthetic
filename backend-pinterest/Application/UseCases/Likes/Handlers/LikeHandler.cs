using Application.Common;
using Application.Common.Exceptions;
using Application.UseCases.Likes.Commands;
using Domain.Events;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Likes.Handlers;

public class LikeHandler(
    ILikeRepository likeRepository,
    IPinRepository pinRepository,
    IUserRepository userRepository,
    IMediator mediator)
    : IRequestHandler<LikeCommand, Unit>
{
    public async Task<Unit> Handle(LikeCommand request, CancellationToken ct)
    {
        await likeRepository.LikeAsync(request.UserId, request.PinId, ct);

        var pin = await pinRepository.GetByIdAsync(request.PinId, ct)
            ?? throw new NotFoundException("Пін не знайдено");

        var liker = await userRepository.GetByIdAsync(request.UserId, ct)
            ?? throw new NotFoundException("Користувача не знайдено");

        await mediator.Publish(new DomainEventNotification<PinLikedEvent>(
            new PinLikedEvent(
                request.UserId,
                pin.CreatorId,
                pin.Id,
                liker.UserName!,
                liker.Image,
                pin.Title!
            )
        ), ct);

        return Unit.Value;
    }
}
