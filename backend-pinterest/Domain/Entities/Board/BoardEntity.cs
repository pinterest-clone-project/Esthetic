using Domain.Entities.Base;
using Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;


namespace Domain.Entities.Board;

[Table("Boards")]
public class BoardEntity : BaseEntity
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public bool IsPrivate { get; set; }
    public bool IsArchived { get; set; }
    public Guid OwnerId { get; set; }
    public UserEntity Owner { get; set; } = null!;
    public virtual ICollection<BoardPinEntity> BoardPins { get; set; } = new List<BoardPinEntity>();

}


