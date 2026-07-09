using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface IUserCategoryRepository
{
    Task<List<UserCategory>> GetAllByUserAsync(Guid userId, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<UserCategory> entities, CancellationToken ct = default);
    Task RemoveRangeAsync(IEnumerable<UserCategory> entities, CancellationToken ct = default);
}