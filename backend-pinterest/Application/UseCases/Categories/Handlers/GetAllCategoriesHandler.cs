using Application.Mappers;
using Application.Models.DTO.Category;
using Application.UseCases.Categories.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Categories.Handlers;

public class GetAllCategoriesHandler(
    ICategoryRepository categoryRepository,
    CategoryMapper categoryMapper) : IRequestHandler<GetAllCategoriesQuery, List<CategoryDTO>>
{
    public async Task<List<CategoryDTO>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await categoryRepository.GetAllAsync(cancellationToken);
        return categories.Select(categoryMapper.ToDto).ToList();
    }
}