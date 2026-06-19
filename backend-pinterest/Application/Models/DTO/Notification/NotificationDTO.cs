using Domain.Enums;

namespace Application.Models.DTO.Notification;

public record NotificationDTO(
    Guid Id,
    NotificationType Type,
    string Message,
    bool IsRead,
    DateTime CreatedAt,
    Guid? ActorId,
    Guid? TargetId,
    string? ActorUsername,
    string? ActorImage
);