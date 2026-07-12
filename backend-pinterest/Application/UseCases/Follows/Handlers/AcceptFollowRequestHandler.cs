using Application.Common;
using Application.Common.Exceptions;
using Application.UseCases.Follows.Commands;
using Domain.Events;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Follows.Handlers;

public class AcceptFollowRequestHandler(
    IFollowRequestRepository followRequestRepository,
    IFollowRepository followRepository,
    IUserRepository userRepository,
    IMediator mediator)
    : IRequestHandler<AcceptFollowRequestCommand, Unit>
{
    public async Task<Unit> Handle(AcceptFollowRequestCommand request, CancellationToken ct)
    {
        var followRequest = await followRequestRepository.GetPendingAsync(request.RequesterId, request.Id, ct)
            ?? throw new NotFoundException("Запит на підписку не знайдено");

        await followRequestRepository.DeleteAsync(followRequest, ct);

        await followRepository.FollowAsync(request.RequesterId, request.Id, ct);

        var requester = await userRepository.GetByIdAsync(request.RequesterId, ct)
            ?? throw new NotFoundException("Користувача не знайдено");

        await mediator.Publish(new DomainEventNotification<UserFollowedEvent>(
            new UserFollowedEvent(
                request.RequesterId,
                request.Id,
                requester.UserName!,
                requester.Image
            )
        ), ct);

        return Unit.Value;
    }
}
