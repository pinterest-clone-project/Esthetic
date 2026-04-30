using Domain.Entities.Base;
using Domain.Entities.Pin;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Board;

[Table("BoardPins")]
public class BoardPinEntity : BaseEntity
{
    public Guid BoardId { get; set; }
    public BoardEntity Board { get; set; } = null!;
    public Guid PinId { get; set; }
    public PinEntity Pin { get; set; } = null!;
}