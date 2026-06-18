using Domain.Entities.Chat;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class ChatRepository(AppDbContext db) : BaseRepository<ChatEntity>(db), IChatRepository
{
    public Task<ChatEntity?> GetByUsersAsync(Guid userId1, Guid userId2, CancellationToken ct = default) =>
        GetQueryable()
            .Include(c => c.User1)
            .Include(c => c.User2)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .FirstOrDefaultAsync(c =>
                (c.User1Id == userId1 && c.User2Id == userId2) ||
                (c.User1Id == userId2 && c.User2Id == userId1), ct);

    public Task<List<ChatEntity>> GetUserChatsAsync(Guid userId, CancellationToken ct = default) =>
        GetQueryable()
            .Where(c => c.User1Id == userId || c.User2Id == userId)
            .Include(c => c.User1)
            .Include(c => c.User2)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .ToListAsync(ct);
}