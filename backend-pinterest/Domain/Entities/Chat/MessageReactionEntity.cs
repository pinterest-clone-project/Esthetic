using Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Chat;

[Table("MessageReactions")]
public class MessageReactionEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MessageId { get; set; }
    public MessageEntity Message { get; set; } = null!;

    public Guid UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public string Emoji { get; set; } = string.Empty;
}
