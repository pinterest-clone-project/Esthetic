using Application.Mappers;
using Application.Models.DTO.Category;
using Application.UseCases.Categories.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Categories.Handlers;

public class GetCategoryByIdHandler(
    ICategoryRepository categoryRepository,
    CategoryMapper categoryMapper) : IRequestHandler<GetCategoryByIdQuery, CategoryDTO>
{
    public async Task<CategoryDTO> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await categoryRepository.GetByIdAsync(request.Id);
        return categoryMapper.ToDto(category!);
    }
}