namespace Domain.Entities.Base;

public interface IEntity
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
    DateTime CreatedAt { get; set; }
    DateTime? UpdatedAt { get; set; }
}
