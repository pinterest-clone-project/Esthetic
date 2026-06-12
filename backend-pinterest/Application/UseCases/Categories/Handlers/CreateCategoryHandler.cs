using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO.Category;
using Application.UseCases.Categories.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Categories.Handlers;

public class CreateCategoryHandler(
    ICategoryRepository categoryRepository,
    CategoryMapper categoryMapper,
    IImageService imageService) : IRequestHandler<CreateCategoryCommand, CategoryDTO>
{
    public async Task<CategoryDTO> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = categoryMapper.ToEntity(request);

        if (request.ImageFile != null)
            category.Image = await imageService.SaveImageAsync(request.ImageFile);

        var created = await categoryRepository.AddAsync(category);
        return categoryMapper.ToDto(created);
    }
}