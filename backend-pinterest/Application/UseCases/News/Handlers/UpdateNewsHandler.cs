using Application.Interfaces;
using Application.Mappers;
using Application.UseCases.News.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.News.Handlers;

public class UpdateNewsHandler(INewsRepository newsRepository, NewsMapper newsMapper, IImageService imageService)
    : IRequestHandler<UpdateNewsCommand>
{
    public async Task Handle(UpdateNewsCommand request, CancellationToken cancellationToken)
    {
        var entity = await newsRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new Exception($"News {request.Id} not found");
        newsMapper.Patch(request, entity);
        if (request.ImageFile != null)
        {
            if (entity.Image != null)
                await imageService.DeleteImageAsync(entity.Image);
            entity.Image = await imageService.SaveImageAsync(request.ImageFile);
        }
        await newsRepository.UpdateAsync(entity, cancellationToken);
    }
}
