using Domain.Entities.Chat;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class MessageRepository(AppDbContext db) : IMessageRepository
{
    public async Task<MessageEntity> AddAsync(MessageEntity entity, CancellationToken ct = default)
    {
        await db.Messages.AddAsync(entity, ct);
        await db.SaveChangesAsync(ct);
        return entity;
    }

    public Task<List<MessageEntity>> GetChatMessagesAsync(Guid chatId, int page, int pageSize, CancellationToken ct = default) =>
        db.Messages
            .Where(m => m.ChatId == chatId)
            .Include(m => m.Sender)
            .OrderByDescending(m => m.SentAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

    public Task<int> GetUnreadCountAsync(Guid chatId, Guid userId, CancellationToken ct = default) =>
        db.Messages.CountAsync(m => m.ChatId == chatId && m.SenderId != userId && !m.IsRead, ct);

    public Task MarkAsReadAsync(Guid chatId, Guid readerId, CancellationToken ct = default) =>
        db.Messages
            .Where(m => m.ChatId == chatId && m.SenderId != readerId && !m.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(m => m.IsRead, true), ct);
}