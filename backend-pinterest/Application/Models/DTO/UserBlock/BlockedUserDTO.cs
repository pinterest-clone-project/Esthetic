namespace Application.Models.DTO.UserBlock;

public class BlockedUserDTO
{
    public Guid UserId { get; set; }
    public string? Name { get; set; }
    public string? Image { get; set; }
}
