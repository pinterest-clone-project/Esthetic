using Domain.Entities.Board;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class BoardPinConfiguration : IEntityTypeConfiguration<BoardPinEntity>
{
    public void Configure(EntityTypeBuilder<BoardPinEntity> builder)
    {
        builder.HasOne(bp => bp.Board)
            .WithMany(b => b.BoardPins)
            .HasForeignKey(bp => bp.BoardId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(bp => bp.Pin)
            .WithMany(p => p.BoardPins)
            .HasForeignKey(bp => bp.PinId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(bp => bp.Section)
            .WithMany(s => s.BoardPins)
            .HasForeignKey(bp => bp.SectionId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(bp => new { bp.BoardId, bp.PinId })
            .IsUnique();
    }
}