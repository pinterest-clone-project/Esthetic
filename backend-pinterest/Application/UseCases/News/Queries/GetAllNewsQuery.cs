using Application.Models.DTO.News;
using MediatR;

namespace Application.UseCases.News.Queries;

public record GetAllNewsQuery : IRequest<List<NewsDTO>>;
