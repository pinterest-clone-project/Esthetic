using Domain.Entities.Pin;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class PinRepository : BaseRepository<PinEntity>, IPinRepository
{
    public PinRepository(AppDbContext db) : base(db) { }
}
