using Application.Models.DTO.Category;
using Application.UseCases.Categories.Queries;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Categories.Handlers;

public class GetCategoryByIdHandler(
    ICategoryRepository categoryRepository,
    IMapper mapper) : IRequestHandler<GetCategoryByIdQuery, CategoryDTO>
{
    public async Task<CategoryDTO> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await categoryRepository.GetByIdAsync(request.Id);
        return mapper.Map<CategoryDTO>(category);
    }
}
