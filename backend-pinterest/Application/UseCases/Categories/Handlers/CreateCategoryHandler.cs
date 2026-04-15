using Application.Interfaces;
using Application.Models.DTO.Category;
using Application.UseCases.Categories.Commands;
using AutoMapper;
using Domain.Entities.Category;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Categories.Handlers;

public class CreateCategoryHandler(
    ICategoryRepository categoryRepository,
    IMapper mapper,
    IImageService imageService) : IRequestHandler<CreateCategoryCommand, CategoryDTO>
{
    public async Task<CategoryDTO> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = mapper.Map<CategoryEntity>(request);

        if (request.ImageFile != null)
        {
            category.Image = await imageService.SaveImageAsync(request.ImageFile);
        }

        var createdCategory = await categoryRepository.AddAsync(category);

        return mapper.Map<CategoryDTO>(createdCategory);
    }
}
