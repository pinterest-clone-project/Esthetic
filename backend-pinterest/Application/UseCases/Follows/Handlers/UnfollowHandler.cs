using Application.UseCases.Follows.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Follows.Handlers;
public class UnfollowHandler(IFollowRepository followRepository) : IRequestHandler<UnfollowCommand, Unit>
{
    public async Task<Unit> Handle(UnfollowCommand request, CancellationToken cancellationToken)
    {
        await followRepository.UnfollowAsync(request.Id, request.FollowedId);
        return Unit.Value;
    }
}