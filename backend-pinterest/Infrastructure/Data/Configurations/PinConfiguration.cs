using Domain.Entities.Pin;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class PinConfiguration : IEntityTypeConfiguration<PinEntity>
{
    public void Configure(EntityTypeBuilder<PinEntity> builder)
    {
        builder.HasOne(p => p.Category)
            .WithMany(c => c.Pins)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}