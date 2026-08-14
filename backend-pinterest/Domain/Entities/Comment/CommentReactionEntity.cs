using Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Comment;

[Table("CommentReactions")]
public class CommentReactionEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid CommentId { get; set; }
    public CommentEntity Comment { get; set; } = null!;

    public Guid UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public string Emoji { get; set; } = string.Empty;
}
