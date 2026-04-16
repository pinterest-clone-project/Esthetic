using Domain.Entities.Category;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class CategoryRepository : BaseRepository<CategoryEntity>, ICategoryRepository
{
    public CategoryRepository(AppDbContext db) : base(db)
    {
    }
}
