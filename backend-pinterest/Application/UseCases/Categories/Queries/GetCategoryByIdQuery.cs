using Application.Models.DTO.Category;
using MediatR;

namespace Application.UseCases.Categories.Queries;

public record GetCategoryByIdQuery(Guid Id) : IRequest<CategoryDTO>;