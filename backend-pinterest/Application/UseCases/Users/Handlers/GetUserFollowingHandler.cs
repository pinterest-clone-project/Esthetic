using Application.Mappers;
using Application.Models.DTO.User;
using Application.UseCases.Users.Queries;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Users.Handlers;

public class GetUserFollowingHandler(
    IFollowRepository followRepository,
    IUserRepository userRepository,
    UserMapper userMapper) : IRequestHandler<GetUserFollowingQuery, List<UserDTO>>
{
    public async Task<List<UserDTO>> Handle(GetUserFollowingQuery request, CancellationToken cancellationToken)
    {
        var ids = await followRepository.GetFollowingIdsAsync(request.UserId, cancellationToken);
        var users = await userRepository.GetQueryable()
            .Where(u => ids.Contains(u.Id))
            .ToListAsync(cancellationToken);
        return users.Select(userMapper.ToDto).ToList();
    }
}
