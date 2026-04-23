using Domain.Entities.Base;
using Domain.Entities.Identity;
using Domain.Entities.Pins;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Comment;

[Table("Comments")]
public class CommentEntity : BaseEntity
{
    public Guid PinId { get; set; }
    public PinEntity Pin { get; set; } = null!;

    public Guid UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public string Text { get; set; } = null!;
}