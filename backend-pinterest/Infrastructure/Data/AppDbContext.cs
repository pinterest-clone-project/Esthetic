using Application.Interfaces;
using Domain.Entities.Board;
using Domain.Entities.BoardSection;
using Domain.Entities.Category;
using Domain.Entities.Chat;
using Domain.Entities.Comment;
using Domain.Entities.Follow;
using Domain.Entities.Identity;
using Domain.Entities.Like;
using Domain.Entities.Notification;
using Domain.Entities.Pin;
using Domain.Entities.PinTag;
using Domain.Entities.Recommended;
using Domain.Entities.Report;
using Domain.Entities.Tag;
using Domain.Entities.UserBlock;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Reflection;

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
    public DbSet<LikeEntity> Likes { get; set; }
    public DbSet<CommentEntity> Comments { get; set; }
    public DbSet<ReportEntity> Reports { get; set; }
    public DbSet<UserBlockEntity> UserBlocks { get; set; }
    public DbSet<BoardEntity> Boards { get; set; }
    public DbSet<BoardPinEntity> BoardPins { get; set; }
    public DbSet<BoardSectionEntity> BoardsSection { get; set; }
    public DbSet<ChatEntity> Chats { get; set; }
    public DbSet<MessageEntity> Messages { get; set; }
    public DbSet<TagEntity> Tags { get; set; }
    public DbSet<NotificationEntity> Notifications { get; set; }
    public DbSet<UserPinInteraction> UserPinInteractions { get; set; }

    public IDbContextTransaction? CurrentTransaction => Database.CurrentTransaction;

    public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default)
        => await Database.BeginTransactionAsync(ct);

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
            v => v.Kind == DateTimeKind.Utc ? v : DateTime.SpecifyKind(v, DateTimeKind.Utc),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        var nullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
            v => v.HasValue
                ? (v.Value.Kind == DateTimeKind.Utc ? v.Value : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc))
                : v,
            v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v);

        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                    property.SetValueConverter(dateTimeConverter);
                else if (property.ClrType == typeof(DateTime?))
                    property.SetValueConverter(nullableDateTimeConverter);
            }
        }

        builder.Entity<UserPinInteraction>().HasIndex(x => new { x.UserId, x.PinId }).IsUnique();

    }
}
