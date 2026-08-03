using Application.UseCases.UserBlock.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.UserBlock.Handlers;
public class IsBlockedHandler(IUserBlockRepository blockRepository)
    : IRequestHandler<IsBlockedQuery, bool>
{
    public async Task<bool> Handle(IsBlockedQuery request, CancellationToken cancellationToken)
        => await blockRepository.IsBlockedAsync(request.BlockerId, request.BlockedId, cancellationToken);
}
