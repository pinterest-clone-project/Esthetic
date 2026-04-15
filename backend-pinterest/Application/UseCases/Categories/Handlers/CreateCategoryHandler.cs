using Application.Models.DTO.Category;
using Application.UseCases.Categories.Commands;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Categories.Handlers;

public class CreateCategoryHandler(
    ICategoryRepository categoryRepository,
    IMapper mapper) : IRequestHandler<CreateCategoryCommand, CategoryDTO>
{
    public Task<CategoryDTO> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
