namespace Application.Models.DTO.Report;

public class ReportDTO
{
    public Guid Id { get; set; }
    public Guid ReporterId { get; set; }
    public Guid? ReportedUserId { get; set; }
    public Guid? ReportedPinId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}