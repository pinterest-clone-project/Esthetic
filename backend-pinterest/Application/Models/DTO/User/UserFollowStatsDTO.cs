namespace Application.Models.DTO.User;
public class UserFollowStatsDTO
{
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
    public bool IsFollowedByMe { get; set; }
    public bool IsRequestedByMe { get; set; }
}
