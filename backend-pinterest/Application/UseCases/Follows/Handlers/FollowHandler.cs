using Application.Common;
using Application.Common.Exceptions;
using Application.UseCases.Follows.Commands;
using Domain.Events;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Follows.Handlers;

public class FollowCommandHandler(
    IFollowRepository followRepository,
    IUserRepository userRepository,
    IMediator mediator)
    : IRequestHandler<FollowCommand, Unit>
{
    public async Task<Unit> Handle(FollowCommand request, CancellationToken ct)
    {
        await followRepository.FollowAsync(request.Id, request.FollowedId, ct);

        var follower = await userRepository.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException("Користувача не знайдено");

        await mediator.Publish(new DomainEventNotification<UserFollowedEvent>(
            new UserFollowedEvent(
                request.Id,
                request.FollowedId,
                follower.UserName!,
                follower.Image
            )
        ), ct);

        return Unit.Value;
    }
}