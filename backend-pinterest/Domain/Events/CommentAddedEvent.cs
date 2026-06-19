namespace Domain.Events;

public record CommentAddedEvent(
    Guid CommenterId,
    Guid PinOwnerId,
    Guid PinId,
    string CommenterUsername,
    string? CommenterImage,
    string PinTitle
) : IDomainEvent;