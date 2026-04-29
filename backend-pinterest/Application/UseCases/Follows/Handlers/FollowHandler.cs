using Application.UseCases.Follows.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Follows.Handlers;

public class FollowHandler(IFollowRepository followRepository) : IRequestHandler<FollowCommand, Unit>
{
    public async Task<Unit> Handle(FollowCommand request, CancellationToken cancellationToken)
    {
        await followRepository.FollowAsync(request.Id, request.FollowedId, cancellationToken);
        return Unit.Value;
    }
}