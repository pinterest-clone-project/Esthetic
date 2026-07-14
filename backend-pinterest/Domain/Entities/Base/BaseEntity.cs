using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.Base;

public abstract class BaseEntity : IEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
    public DateTime? UpdatedAt { get; set; }
}
