using Application.Models.DTO.UserBlock;
using Application.UseCases.UserBlock.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.BlockUsers.Handlers;

public class GetBlockedUsersHandler(IUserBlockRepository repository)
    : IRequestHandler<GetBlockedUsersQuery, List<BlockedUserDTO>>
{
    public async Task<List<BlockedUserDTO>> Handle(GetBlockedUsersQuery request, CancellationToken ct)
    {
        var blocked = await repository.GetBlockedUsersAsync(request.BlockerId, ct);
        return blocked.Select(b => new BlockedUserDTO
        {
            UserId = b.BlockedId,
            Name = b.Blocked.FirstName + " " + b.Blocked.LastName,
            Image = b.Blocked.Image,
        }).ToList();
    }
}
