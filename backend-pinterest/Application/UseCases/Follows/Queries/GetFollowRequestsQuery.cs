using Application.Models.DTO.Follow;
using MediatR;

namespace Application.UseCases.Follows.Queries;

public record GetFollowRequestsQuery(Guid UserId) : IRequest<List<FollowRequestDTO>>;
