using Domain.Entities.Base;
using Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Chat;

[Table("Chats")]
public class ChatEntity : BaseEntity
{
    public Guid User1Id { get; set; }
    public UserEntity User1 { get; set; } = null!;

    public Guid User2Id { get; set; }
    public UserEntity User2 { get; set; } = null!;

}