namespace Domain.Events;

public record FollowRequestReceivedEvent(
    Guid SenderId,
    Guid ReceiverId,
    string SenderUsername,
    string? SenderImage
) : IDomainEvent;
