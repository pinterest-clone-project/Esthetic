using Domain.Entities.Tag;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class TagRepository : BaseRepository<TagEntity>, ITagRepository
{
    public TagRepository(AppDbContext db): base(db) { }
}
