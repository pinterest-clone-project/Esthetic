using Application.Common;
using Application.Common.Exceptions;
using Application.UseCases.Follows.Commands;
using Domain.Events;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Follows.Handlers;

public class SendFollowRequestHandler(
    IFollowRequestRepository followRequestRepository,
    IUserRepository userRepository,
    IMediator mediator)
    : IRequestHandler<SendFollowRequestCommand, Unit>
{
    public async Task<Unit> Handle(SendFollowRequestCommand request, CancellationToken ct)
    {
        var alreadyPending = await followRequestRepository.HasPendingRequestAsync(request.Id, request.TargetId, ct);
        if (alreadyPending)
            throw new ConflictException("Запит на підписку вже надіслано");

        await followRequestRepository.SendRequestAsync(request.Id, request.TargetId, ct);

        var sender = await userRepository.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException("Користувача не знайдено");

        await mediator.Publish(new DomainEventNotification<FollowRequestReceivedEvent>(
            new FollowRequestReceivedEvent(
                request.Id,
                request.TargetId,
                sender.UserName!,
                sender.Image
            )
        ), ct);

        return Unit.Value;
    }
}
