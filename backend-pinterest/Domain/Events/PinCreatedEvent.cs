

namespace Domain.Events;

public record PinCreatedEvent(
    Guid CreatorId,
    Guid PinId,
    string CreatorUsername,
    string? creatorImage,
    string PinTitle
) : IDomainEvent;


