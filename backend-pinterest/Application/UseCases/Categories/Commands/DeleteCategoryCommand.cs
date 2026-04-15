using MediatR;

namespace Application.UseCases.Categories.Commands;

public record DeleteCategoryCommand(Guid Id) : IRequest<Unit>;