using Application.Common.Exceptions;
using Application.Models.DTO.Category;
using Application.UseCases.Categories.Commands;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Categories.Handlers;

public class UpdateCategoryHandler(
    ICategoryRepository categoryRepository,
    IMapper mapper) : IRequestHandler<UpdateCategoryCommand, CategoryDTO>
{
    public async Task<CategoryDTO> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await categoryRepository.GetByIdAsync(request.Id);
        if (category is null)
        {
            throw new NotFoundException($"Category with ID {request.Id} not found.");
        }

        mapper.Map(request, category);
        await categoryRepository.UpdateAsync(category);
        return mapper.Map<CategoryDTO>(category);
    }
}
