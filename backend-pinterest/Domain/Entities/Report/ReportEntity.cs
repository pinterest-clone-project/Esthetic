using Domain.Entities.Base;
using Domain.Entities.Identity;
using Domain.Entities.Pin;
using Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Report;

[Table("Reports")]
public class ReportEntity : BaseEntity
{
    public Guid ReporterId { get; set; }
    public UserEntity Reporter { get; set; } = null!;

    public Guid? ReportedUserId { get; set; }
    public UserEntity? ReportedUser { get; set; }

    public Guid? ReportedPinId { get; set; }
    public PinEntity? ReportedPin { get; set; }

    public string Reason { get; set; } = null!;
    public ReportStatus Status { get; set; } = ReportStatus.Pending;
}