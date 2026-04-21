using Domain.Entities.Like;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class LikeConfiguration : IEntityTypeConfiguration<LikeEntity>
{
    public void Configure(EntityTypeBuilder<LikeEntity> builder)
    {
        builder.HasKey(l => new { l.PinId, l.UserId });

        builder.HasOne(l => l.Pin)
            .WithMany(p => p.Likes)
            .HasForeignKey(l => l.PinId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(l => l.User)
            .WithMany(u => u.Likes)
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
