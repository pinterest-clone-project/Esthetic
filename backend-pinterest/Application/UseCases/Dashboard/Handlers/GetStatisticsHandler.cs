using Application.UseCases.Dashboard.Queries;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Dashboard.Handlers;

public class GetStatisticsHandler(
    IUserRepository userRepository,
    IPinRepository pinRepository,
    IBoardRepository boardRepository,
    ITagRepository tagRepository,
    ICategoryRepository categoryRepository) : IRequestHandler<GetStatisticsQuery, StatisticsDto>
{
    public async Task<StatisticsDto> Handle(GetStatisticsQuery request, CancellationToken cancellationToken)
    {
        var userCount = await userRepository.GetQueryable().CountAsync(cancellationToken);
        var pinCount = await pinRepository.GetQueryable().CountAsync(cancellationToken);
        var boardCount = await boardRepository.GetQueryable().CountAsync(cancellationToken);
        var tagCount = await tagRepository.GetQueryable().CountAsync(cancellationToken);
        var categoryCount = await categoryRepository.GetQueryable().CountAsync(cancellationToken);

        return new StatisticsDto(
            userCount,
            pinCount,
            boardCount,
            tagCount,
            categoryCount
        );
    }
}
