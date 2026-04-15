using Application.Models.DTO.Category;
using Application.UseCases.Categories.Commands;
using AutoMapper;
using Domain.Entities.Category;

namespace Application.Mappers;

public class CategoryMapper : Profile
{
    public CategoryMapper()
    {
        CreateMap<CategoryEntity, CategoryDTO>();
        CreateMap<CreateCategoryCommand, CategoryEntity>();
    }
}
