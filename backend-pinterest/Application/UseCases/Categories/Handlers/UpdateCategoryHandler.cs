using Application.Common.Exceptions;
using Application.Mappers;
using Application.Models.DTO.Category;
using Application.UseCases.Categories.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Categories.Handlers;

public class UpdateCategoryHandler(
    ICategoryRepository categoryRepository,
    CategoryMapper categoryMapper) : IRequestHandler<UpdateCategoryCommand, CategoryDTO>
{
    public async Task<CategoryDTO> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await categoryRepository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException($"Category with ID {request.Id} not found.");

        categoryMapper.Patch(request, category);
        await categoryRepository.UpdateAsync(category);
        return categoryMapper.ToDto(category);
    }
}