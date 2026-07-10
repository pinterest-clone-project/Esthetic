using MediatR;
using Application.Models.DTO.User;

namespace Application.UseCases.Users.Queries;
public record GetUserFollowStatsQuery(Guid UserId, Guid CurrentUserId) : IRequest<UserFollowStatsDTO>;
