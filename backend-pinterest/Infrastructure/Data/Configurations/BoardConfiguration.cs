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
      }
}

