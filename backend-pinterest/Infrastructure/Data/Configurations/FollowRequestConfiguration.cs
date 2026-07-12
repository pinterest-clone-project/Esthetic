using Domain.Entities.Follow;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class FollowRequestConfiguration : IEntityTypeConfiguration<FollowRequestEntity>
{
    public void Configure(EntityTypeBuilder<FollowRequestEntity> builder)
    {
        builder.ToTable("FollowRequests");

        builder.HasKey(r => r.Id);

        builder.HasOne(r => r.Sender)
            .WithMany(u => u.SentFollowRequests)
            .HasForeignKey(r => r.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Receiver)
            .WithMany(u => u.ReceivedFollowRequests)
            .HasForeignKey(r => r.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(r => r.ReceiverId);

        builder.HasIndex(r => new { r.SenderId, r.ReceiverId })
            .IsUnique()
            .HasFilter("\"Status\" = 0");
    }
}
