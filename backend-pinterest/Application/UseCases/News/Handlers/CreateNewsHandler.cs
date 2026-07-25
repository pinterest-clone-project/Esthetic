using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO.News;
using Application.UseCases.News.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.News.Handlers;

public class CreateNewsHandler(INewsRepository newsRepository, NewsMapper newsMapper, IImageService imageService)
    : IRequestHandler<CreateNewsCommand, NewsDTO>
{
    public async Task<NewsDTO> Handle(CreateNewsCommand request, CancellationToken cancellationToken)
    {
        var entity = newsMapper.ToEntity(request);
        if (request.ImageFile != null)
            entity.Image = await imageService.SaveImageAsync(request.ImageFile);
        var created = await newsRepository.AddAsync(entity, cancellationToken);
        return newsMapper.ToDto(created);
    }
}
