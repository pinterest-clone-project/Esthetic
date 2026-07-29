using Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Chat;

[Table("Messages")]
public class MessageEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ChatId { get; set; }
    public ChatEntity Chat { get; set; } = null!;

    public Guid SenderId { get; set; }
    public UserEntity Sender { get; set; } = null!;

    public string Content { get; set; } = string.Empty;

    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; } = false;

    public ICollection<MessageReactionEntity> Reactions { get; set; } = [];
}
