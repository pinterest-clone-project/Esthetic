using Application.Interfaces;
using Domain.Entities;
using Domain.Entities.Category;
using Domain.Entities.Follow;
using Domain.Entities.Identity;
using Domain.Entities.Pins;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Reflection.Emit;

namespace Infrastructure.Data;

public class AppDbContext : IdentityDbContext<UserEntity, RoleEntity, Guid,
        IdentityUserClaim<Guid>, UserRoleEntity, UserLoginEntity,
        IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<RefreshTokenEntity> RefreshTokens { get; set; }
    public DbSet<FollowEntity> Follows { get; set; }
    public DbSet<PinEntity> Pins { get; set; }
    public DbSet<CategoryEntity> Categories { get; set; }
    public DbSet<PinTagEntity> PinTags { get; set; }

    public IDbContextTransaction? CurrentTransaction => Database.CurrentTransaction;

    public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default)
        => await Database.BeginTransactionAsync(ct);

    public DbSet<TagEntity> Tags { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<UserRoleEntity>(ur =>
        {
            ur.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(r => r.RoleId)
                .IsRequired();
        });

        builder.Entity<UserLoginEntity>(b =>
        {
            b.HasOne(l => l.User)
                .WithMany(u => u.UserLogins)
                .HasForeignKey(l => l.UserId)
                .IsRequired();
        });

        builder.Entity<FollowEntity>(b =>
        {
            b.HasKey(f => new { f.FollowerId, f.FolloweeId });

            b.HasOne(f => f.Follower)
                .WithMany(u => u.Following)
                .HasForeignKey(f => f.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(f => f.Followee)
                .WithMany(u => u.Followers)
                .HasForeignKey(f => f.FolloweeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<PinTagEntity>(entity =>
        {
            entity.HasKey(pt => new { pt.PinId, pt.TagId });

            entity.HasOne(pt => pt.Pin)
                .WithMany(p => p.PinTags)
                .HasForeignKey(pt => pt.PinId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pt => pt.Tag)
                .WithMany(t => t.PinTags)
                .HasForeignKey(pt => pt.TagId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
