using Application.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Application.Interfaces;

public interface IPagedService
{
    Task<PagedResult<TDto>> GetPagedAsync<T, TDto>(
        IQueryable<T> query,
        Expression<Func<T, TDto>> selector,
        int page,
        int pageSize,
        CancellationToken ct = default);
}