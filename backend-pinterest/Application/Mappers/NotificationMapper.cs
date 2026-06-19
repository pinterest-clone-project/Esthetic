using Application.Models.DTO.Notification;
using Domain.Entities.Notification;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class NotificationMapper
{
    public partial NotificationDTO ToDTO(NotificationEntity entity);
}