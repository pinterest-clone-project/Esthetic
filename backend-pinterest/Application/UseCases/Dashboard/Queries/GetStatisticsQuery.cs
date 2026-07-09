using MediatR;

namespace Application.UseCases.Dashboard.Queries;

public record GetStatisticsQuery() : IRequest<StatisticsDto>;

public record StatisticsDto(
    int UserCount,
    int PinCount,
    int BoardCount,
    int TagCount,
    int CategoryCount
);

public record GetDailyStatisticsQuery() : IRequest<DailyStatisticsDto>;

public record DailyStatisticsDto(
    List<DailyUserCount> DailyUserCounts,
    List<DailyPinCount> DailyPinCounts
);

public record DailyUserCount(
    string Date,
    int Count
);

public record DailyPinCount(
    string Date,
    int Count
);
