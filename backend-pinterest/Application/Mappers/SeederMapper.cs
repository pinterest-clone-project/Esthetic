using Application.Models.SeedDTO;
using Domain.Entities.Category;
using Domain.Entities.Identity;
using Domain.Entities.Tag;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class SeederMapper
{
    [MapperIgnoreTarget(nameof(UserEntity.Image))]
    public partial UserEntity ToEntity(UserSeedDTO src);

    public partial TagEntity ToEntity(TagSeedDTO src);

    [MapperIgnoreTarget(nameof(CategoryEntity.Image))]
    public partial CategoryEntity ToEntity(CategorySeedDTO src);
}