using Domain.Entities.Base;
using Domain.Entities.Board;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.BoardSection;

[Table("BoardSections")]
public class BoardSectionEntity : BaseEntity
{
    public string Title { get; set; } = null!;

    public Guid BoardId { get; set; }
    public BoardEntity Board { get; set; } = null!;

    public virtual ICollection<BoardPinEntity> BoardPins { get; set; } = new List<BoardPinEntity>();
}