using Domain.Entities.Board;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace Infrastructure.Data.Configurations;

public class BoardConfiguration : IEntityTypeConfiguration<BoardEntity>
{
     public void Configure(EntityTypeBuilder<BoardEntity> builder)
     {
        builder.HasOne(b => b.Owner)
            .WithMany()
            .HasForeignKey(b => b.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(b => b.BoardPins)
            .WithOne(bp => bp.Board)
            .HasForeignKey(bp => bp.BoardId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(b => b.Sections)
            .WithOne(s => s.Board)
            .HasForeignKey(s => s.BoardId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

