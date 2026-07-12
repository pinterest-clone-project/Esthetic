using Application.Common.Exceptions;
using Application.UseCases.Follows.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Follows.Handlers;

public class DeclineFollowRequestHandler(
    IFollowRequestRepository followRequestRepository)
    : IRequestHandler<DeclineFollowRequestCommand, Unit>
{
    public async Task<Unit> Handle(DeclineFollowRequestCommand request, CancellationToken ct)
    {
        var followRequest = await followRequestRepository.GetPendingAsync(request.RequesterId, request.Id, ct)
            ?? throw new NotFoundException("Запит на підписку не знайдено");

        await followRequestRepository.DeleteAsync(followRequest, ct);

        return Unit.Value;
    }
}
