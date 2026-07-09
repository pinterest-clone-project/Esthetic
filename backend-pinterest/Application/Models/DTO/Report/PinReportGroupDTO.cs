namespace Application.Models.DTO.Report;

public class PinReportGroupDTO
{
    public Guid PinId { get; set; }
    public string? PinImage { get; set; }
    public Guid PinCreatorId { get; set; }
    public string? PinCreatorUserName { get; set; }
    public int ReportsCount { get; set; }
    public DateTime LatestReportAt { get; set; }
    public List<ReportDTO> Reports { get; set; } = [];
}