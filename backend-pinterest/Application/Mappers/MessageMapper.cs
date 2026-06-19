using Application.Models.DTO.Chat;
using Domain.Entities.Chat;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class MessageMapper
{
    public partial MessageDTO ToDTO(MessageEntity entity);
}