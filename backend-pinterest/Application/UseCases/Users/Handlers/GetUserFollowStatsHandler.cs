using Application.Models.DTO.User;
using Application.UseCases.Users.Queries;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Users.Handlers;
public class GetUserFollowStatsHandler(IFollowRepository followRepository)
    : IRequestHandler<GetUserFollowStatsQuery, UserFollowStatsDTO>
{
    public async Task<UserFollowStatsDTO> Handle(GetUserFollowStatsQuery request, CancellationToken ct)
    {
        var followersCount = await followRepository.GetQueryable()
            .CountAsync(f => f.FolloweeId == request.UserId, ct);

        var followingCount = await followRepository.GetQueryable()
            .CountAsync(f => f.FollowerId == request.UserId, ct);

        var isFollowedByMe = request.CurrentUserId != Guid.Empty
            && await followRepository.GetQueryable()
                .AnyAsync(f => f.FollowerId == request.CurrentUserId && f.FolloweeId == request.UserId, ct);

        return new UserFollowStatsDTO
        {
            FollowersCount = followersCount,
            FollowingCount = followingCount,
            IsFollowedByMe = isFollowedByMe,
        };
    }
}
