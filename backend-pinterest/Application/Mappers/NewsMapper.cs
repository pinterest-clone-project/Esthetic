using Application.Models.DTO.News;
using Application.UseCases.News.Commands;
using Domain.Entities.News;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class NewsMapper
{
    public partial NewsDTO ToDto(NewsEntity src);
    public partial NewsEntity ToEntity(CreateNewsCommand src);
    public partial void Patch(UpdateNewsCommand src, NewsEntity dest);
}
