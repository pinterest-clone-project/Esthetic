using Domain.Entities.UserBlock;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class UserBlockConfiguration : IEntityTypeConfiguration<UserBlockEntity>
{
    public void Configure(EntityTypeBuilder<UserBlockEntity> builder)
    {
        builder.HasKey(b => new { b.BlockerId, b.BlockedId });

        builder.HasOne(b => b.Blocker)
            .WithMany(u => u.BlockedUsers)
            .HasForeignKey(b => b.BlockerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.Blocked)
            .WithMany(u => u.BlockedByUsers)
            .HasForeignKey(b => b.BlockedId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
