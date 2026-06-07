using Application.Models.DTO.Tag;
using Application.UseCases.Tags.Commands;
using Domain.Entities.Tag;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class TagMapper
{
    public partial TagDTO ToDto(TagEntity src);
    public partial TagEntity ToEntity(CreateTagCommand src);
    public partial TagEntity ToEntity(UpdateTagCommand src);
}