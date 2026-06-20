namespace Domain.Events;

public record UserFollowedEvent(
    Guid FollowerId,
    Guid FolloweeId,
    string FollowerUsername,
    string? FollowerImage
) : IDomainEvent;