using Domain.Entities.Report;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class ReportConfiguration : IEntityTypeConfiguration<ReportEntity>
{
    public void Configure(EntityTypeBuilder<ReportEntity> builder)
    {
        builder.HasOne(r => r.Reporter)
               .WithMany(u => u.SentReports)
               .HasForeignKey(r => r.ReporterId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.ReportedUser)
               .WithMany(u => u.ReceivedReports)
               .HasForeignKey(r => r.ReportedUserId)
               .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(r => r.ReportedPin)
               .WithMany(p => p.Reports)
               .HasForeignKey(r => r.ReportedPinId)
               .OnDelete(DeleteBehavior.SetNull);

        builder.Property(r => r.Status)
               .HasConversion<string>();
    }
}