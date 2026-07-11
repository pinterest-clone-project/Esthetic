using Application.Models.DTO.Follow;
using Application.UseCases.Follows.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Follows.Handlers;

public class GetFollowRequestsHandler(
    IFollowRequestRepository followRequestRepository)
    : IRequestHandler<GetFollowRequestsQuery, List<FollowRequestDTO>>
{
    public async Task<List<FollowRequestDTO>> Handle(GetFollowRequestsQuery request, CancellationToken ct)
    {
        var requests = await followRequestRepository.GetPendingRequestsForUserAsync(request.UserId, ct);

        return requests.Select(r => new FollowRequestDTO
        {
            SenderId = r.SenderId,
            SenderUsername = r.Sender?.UserName ?? "",
            SenderImage = r.Sender?.Image,
            CreatedAt = r.CreatedAt
        }).ToList();
    }
}
