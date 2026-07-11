using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserCategoryRepository(AppDbContext context) : IUserCategoryRepository
{
    public async Task<List<UserCategory>> GetAllByUserAsync(Guid userId, CancellationToken ct = default)
    {
        return await context.UserCategories
            .Where(uc => uc.UserId == userId)
            .ToListAsync(ct);
    }

    public async Task AddRangeAsync(IEnumerable<UserCategory> entities, CancellationToken ct = default)
    {
        await context.UserCategories.AddRangeAsync(entities, ct);
        await context.SaveChangesAsync(ct);
    }

    public async Task RemoveRangeAsync(IEnumerable<UserCategory> entities, CancellationToken ct = default)
    {
        context.UserCategories.RemoveRange(entities);
        await context.SaveChangesAsync(ct);
    }
}