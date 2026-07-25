using Application.Interfaces;
using Application.UseCases.News.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.News.Handlers;

public class DeleteNewsHandler(INewsRepository newsRepository, IImageService imageService)
    : IRequestHandler<DeleteNewsCommand>
{
    public async Task Handle(DeleteNewsCommand request, CancellationToken cancellationToken)
    {
        var entity = await newsRepository.GetByIdAsync(request.Id, cancellationToken);
        if (entity == null) return;
        if (entity.Image != null)
            await imageService.DeleteImageAsync(entity.Image);
        await newsRepository.DeleteAsync(request.Id, cancellationToken);
    }
}
