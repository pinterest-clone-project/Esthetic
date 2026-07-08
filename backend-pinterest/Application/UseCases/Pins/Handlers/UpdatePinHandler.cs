using Application.Common.Exceptions;
using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO.Category;
using Application.UseCases.Categories.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class UpdateCategoryHandler(
    ICategoryRepository categoryRepository,
    CategoryMapper categoryMapper,
    IImageService imageService) : IRequestHandler<UpdateCategoryCommand, CategoryDTO>
{
    public async Task<CategoryDTO> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await categoryRepository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException($"Category with ID {request.Id} not found.");

        categoryMapper.Patch(request, category);

        if (request.ImageFile != null)
            category.Image = await imageService.SaveImageAsync(request.ImageFile);

        await categoryRepository.UpdateAsync(category);
        return categoryMapper.ToDto(category);
    }
}