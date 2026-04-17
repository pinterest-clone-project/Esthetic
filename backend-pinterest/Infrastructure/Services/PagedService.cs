using Application.Interfaces;
using Application.Models.DTO;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class PagedService : IPagedService
{
    public async Task<PagedResult<TDto>> GetPagedAsync<T, TDto>(
        IQueryable<T> query,
        Expression<Func<T, TDto>> selector,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var total = await query.CountAsync(ct);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(selector)
            .ToListAsync(ct);

        return new PagedResult<TDto>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }
}