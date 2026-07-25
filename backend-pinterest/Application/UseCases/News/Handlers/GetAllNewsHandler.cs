using Application.Mappers;
using Application.Models.DTO.News;
using Application.UseCases.News.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.News.Handlers;

public class GetAllNewsHandler(INewsRepository newsRepository, NewsMapper newsMapper)
    : IRequestHandler<GetAllNewsQuery, List<NewsDTO>>
{
    public async Task<List<NewsDTO>> Handle(GetAllNewsQuery request, CancellationToken cancellationToken)
    {
        var news = await newsRepository.GetAllAsync(cancellationToken);
        return news
            .OrderByDescending(n => n.PublishedAt)
            .Select(newsMapper.ToDto)
            .ToList();
    }
}
