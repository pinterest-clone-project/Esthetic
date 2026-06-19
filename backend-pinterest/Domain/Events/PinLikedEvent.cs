namespace Domain.Events;

public record PinLikedEvent(
    Guid LikerId,
    Guid PinOwnerId,
    Guid PinId, 
    string LikerUsername,
    string? LikerImage, 
    string PinTitle
) : IDomainEvent;