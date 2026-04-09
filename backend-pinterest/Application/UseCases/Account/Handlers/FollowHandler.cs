using Application.UseCases.Account.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Account.Handlers;

public class FollowHandler(IFollowRepository followRepository) : IRequestHandler<FollowCommand, Unit>
{
    public async Task<Unit> Handle(FollowCommand request, CancellationToken cancellationToken)
    {
        await followRepository.FollowAsync(request.Id, request.FollowedId, cancellationToken);
        return Unit.Value;
    }
}
