using Domain.Entities.Identity;
using Domain.Enums;

namespace Domain.Entities.Follow;

public class FollowRequestEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SenderId { get; set; }
    public virtual UserEntity Sender { get; set; } = null!;
    public Guid ReceiverId { get; set; }
    public virtual UserEntity Receiver { get; set; } = null!;
    public FollowRequestStatus Status { get; set; } = FollowRequestStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
}
