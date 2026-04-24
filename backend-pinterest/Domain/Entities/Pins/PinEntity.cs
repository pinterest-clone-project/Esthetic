using Domain.Entities.Base;
<<<<<<< HEAD
using Domain.Entities;
=======
using Domain.Entities.Category;
using Domain.Entities.Comment;
using Domain.Entities.Identity;
using Domain.Entities.Like;
using Domain.Entities.PinTag;
>>>>>>> 30e64b54934ffbed940f3364bc55c6d749a45c0a
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Pins;

[Table("Pins")]
public class PinEntity : BaseEntity
{
    public Guid CreatorId { get; set; }
    public UserEntity Creator { get; set; } = null!;

    public string? Title { get; set; } = null;
    public string? Description { get; set; } = null;
<<<<<<< HEAD
    public string? Media_Url { get; set; } = null;
    public string? Source_Url { get; set; } = null;
    public virtual ICollection<TagEntity>? Tags { get; set; }
=======
    public string? MediaUrl { get; set; } = null;
    public string? SourceUrl { get; set; } = null;

    public Guid? CategoryId { get; set; }
    public CategoryEntity? Category { get; set; }

    public virtual ICollection<PinTagEntity>? PinTags { get; set; }
    public virtual ICollection<LikeEntity>? Likes { get; set; }
    public virtual ICollection<CommentEntity>? Comments { get; set; }
>>>>>>> 30e64b54934ffbed940f3364bc55c6d749a45c0a
}
