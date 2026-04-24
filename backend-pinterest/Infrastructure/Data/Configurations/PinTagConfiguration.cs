using Domain.Entities.PinTag;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class PinTagConfiguration : IEntityTypeConfiguration<PinTagEntity>
{
    public void Configure(EntityTypeBuilder<PinTagEntity> builder)
    {
        builder.HasKey(pt => new { pt.PinId, pt.TagId });

        builder.HasOne(pt => pt.Pin)
            .WithMany(p => p.PinTags)
            .HasForeignKey(pt => pt.PinId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pt => pt.Tag)
            .WithMany(t => t.PinTags)
            .HasForeignKey(pt => pt.TagId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}