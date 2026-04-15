using Application.Models.DTO.Category;
using AutoMapper;
using Domain.Entities.Category;

namespace Application.Mappers;

public class CategoryMapper : Profile
{
    public CategoryMapper()
    {
        CreateMap<CategoryEntity, CategoryDTO>();
    }
}
