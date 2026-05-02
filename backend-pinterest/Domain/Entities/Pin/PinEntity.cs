using Domain.Entities.Base;
using Domain.Entities.Board;
using Domain.Entities.Category;
using Domain.Entities.Comment;
using Domain.Entities.Identity;
using Domain.Entities.Like;
using Domain.Entities.PinTag;
using Domain.Entities.Report;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Pin;

[Table("Pins")]
public class PinEntity : BaseEntity
{
    public Guid CreatorId { get; set; }
    public UserEntity Creator { get; set; } = null!;

    public string? Title { get; set; } = null;
    public string? Description { get; set; } = null;
    public string? MediaUrl { get; set; } = null;
    public string? SourceUrl { get; set; } = null;

    public Guid? CategoryId { get; set; }
    public CategoryEntity? Category { get; set; }

    public virtual ICollection<PinTagEntity>? PinTags { get; set; }
    public virtual ICollection<LikeEntity>? Likes { get; set; }
    public virtual ICollection<CommentEntity>? Comments { get; set; }
    public virtual ICollection<ReportEntity>? Reports { get; set; }
    public virtual ICollection<BoardPinEntity> BoardPins { get; set; } = new List<BoardPinEntity>();

}
