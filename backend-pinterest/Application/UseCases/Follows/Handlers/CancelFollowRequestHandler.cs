using Application.Common.Exceptions;
using Application.UseCases.Follows.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Follows.Handlers;

public class CancelFollowRequestHandler(
    IFollowRequestRepository followRequestRepository)
    : IRequestHandler<CancelFollowRequestCommand, Unit>
{
    public async Task<Unit> Handle(CancelFollowRequestCommand request, CancellationToken ct)
    {
        var followRequest = await followRequestRepository.GetPendingAsync(request.Id, request.TargetId, ct)
            ?? throw new NotFoundException("Запит на підписку не знайдено");

        await followRequestRepository.DeleteAsync(followRequest, ct);

        return Unit.Value;
    }
}
