using Application.Models.DTO.Category;
using Application.UseCases.Categories.Commands;
using Domain.Entities.Category;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class CategoryMapper
{
    public partial CategoryDTO ToDto(CategoryEntity src);
    public partial CategoryEntity ToEntity(CreateCategoryCommand src);
    public partial CategoryEntity ToEntity(UpdateCategoryCommand src);
    public partial void Patch(UpdateCategoryCommand src, CategoryEntity dest);
}