using Application.UseCases.Categories.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Categories.Handlers;

public class DeleteCategoryHandler(
    ICategoryRepository categoryRepository) : IRequestHandler<DeleteCategoryCommand, Unit>
{
    public async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        await categoryRepository.DeleteAsync(request.Id, cancellationToken);

        return Unit.Value;
    }
}
