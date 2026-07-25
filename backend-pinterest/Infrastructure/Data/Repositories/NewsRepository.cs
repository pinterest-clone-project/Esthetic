using Domain.Entities.News;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class NewsRepository : BaseRepository<NewsEntity>, INewsRepository
{
    public NewsRepository(AppDbContext db) : base(db) { }
}
