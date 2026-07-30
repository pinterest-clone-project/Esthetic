using Domain.Entities.Chat;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class MessageReactionRepository(AppDbContext db) : IMessageReactionRepository
{
    public async Task<List<MessageReactionEntity>> ToggleAsync(Guid messageId, Guid userId, string emoji, CancellationToken ct = default)
    {
        var existing = await db.MessageReactions
            .FirstOrDefaultAsync(r => r.MessageId == messageId && r.UserId == userId, ct);

        if (existing is not null)
        {
            if (existing.Emoji == emoji)
                db.MessageReactions.Remove(existing);
            else
                existing.Emoji = emoji;
        }
        else
        {
            db.MessageReactions.Add(new MessageReactionEntity
            {
                MessageId = messageId,
                UserId = userId,
                Emoji = emoji
            });
        }

        await db.SaveChangesAsync(ct);

        return await db.MessageReactions
            .Where(r => r.MessageId == messageId)
            .ToListAsync(ct);
    }
}
