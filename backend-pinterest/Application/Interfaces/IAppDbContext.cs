using Microsoft.EntityFrameworkCore.Storage;

namespace Application.Interfaces;

public interface IAppDbContext
{
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default);
    IDbContextTransaction? CurrentTransaction { get; }
}