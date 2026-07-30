using Domain.Entities.Chat;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class MessageReactionConfiguration : IEntityTypeConfiguration<MessageReactionEntity>
{
    public void Configure(EntityTypeBuilder<MessageReactionEntity> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Emoji)
            .IsRequired()
            .HasMaxLength(10);

        builder.HasOne(r => r.Message)
            .WithMany(m => m.Reactions)
            .HasForeignKey(r => r.MessageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(r => new { r.MessageId, r.UserId }).IsUnique();
    }
}
