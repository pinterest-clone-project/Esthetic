

namespace Domain.Events;

public record PinCreatedEvent(
    Guid CreatorId,
    Guid PinId,
    string CreatorUsername,
    string? CreatorImage,
    string PinTitle
) : IDomainEvent;


