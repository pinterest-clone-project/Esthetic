using Application.Mappers;
using Application.Models.DTO.News;
using Application.UseCases.News.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.News.Handlers;

public class GetNewsByIdHandler(INewsRepository newsRepository, NewsMapper newsMapper)
    : IRequestHandler<GetNewsByIdQuery, NewsDTO?>
{
    public async Task<NewsDTO?> Handle(GetNewsByIdQuery request, CancellationToken cancellationToken)
    {
        var news = await newsRepository.GetByIdAsync(request.Id, cancellationToken);
        return news != null ? newsMapper.ToDto(news) : null;
    }
}
