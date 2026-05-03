using Domain.Entities.BoardSection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class BoardSectionConfiguration : IEntityTypeConfiguration<BoardSectionEntity>
{
    public void Configure(EntityTypeBuilder<BoardSectionEntity> builder)
    {
        builder.HasOne(s => s.Board)
            .WithMany(b => b.Sections)
            .HasForeignKey(s => s.BoardId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(s => s.BoardPins)
            .WithOne(bp => bp.Section)
            .HasForeignKey(bp => bp.SectionId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}