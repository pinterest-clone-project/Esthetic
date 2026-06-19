using Application.Behaviors;
using Application.Common.Optional;
using Application.Common.Validators;
using Application.Interfaces;
using Application.Mappers;
using backend_pinterest.Middleware;
using Domain.Constants;
using Domain.Entities.Identity;
using Domain.Interfaces;
using FluentValidation;
using Infrastructure.Data;
using Infrastructure.Data.Repositories;
using Infrastructure.Jobs;
using Infrastructure.Middleware;
using Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Quartz;
using System.Globalization;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace backend_pinterest.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static WebApplicationBuilder ConfigureApplicationBuilder(this WebApplicationBuilder builder)
    {
        var services = builder.Services;
        var config = builder.Configuration;

        #region DbContext
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(config.GetConnectionString("DefaultConnection"))
        );

        services.AddScoped<IAppDbContext>(sp =>
            sp.GetRequiredService<AppDbContext>());
        #endregion

        #region Identity
        services.AddIdentity<UserEntity, RoleEntity>(options =>
        {
            options.Password.RequiredLength = 6;
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();
        #endregion

        #region JWT
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(config["Jwt:Key"]!)
                )
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies[AuthTokenConstants.AccessTokenCookie];
                    return Task.CompletedTask;
                },
                OnChallenge = async context =>
                {
                    context.HandleResponse();

                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";

                    await context.Response.WriteAsJsonAsync(new
                    {
                        status = 401,
                        title = ValidationMessages.ErrorUnauthorized,
                        detail = ValidationMessages.ErrorTokenInvalid
                    });
                },
                OnForbidden = async context =>
                {
                    context.Response.StatusCode = 403;
                    context.Response.ContentType = "application/json";

                    await context.Response.WriteAsJsonAsync(new
                    {
                        status = 403,
                        title = ValidationMessages.ErrorForbidden,
                        detail = ValidationMessages.ErrorNoPermission
                    });
                }
            };
        });
        #endregion

        services.AddAuthorization();

        #region Infrastructure & MediatR
        services.AddHttpClient();
        services.AddHttpContextAccessor();

        services.AddLocalization();
        services.Configure<RequestLocalizationOptions>(options =>
        {
            var supported = SupportedCultures.AllCultures.Select(c => new CultureInfo(c)).ToArray();
            options.SetDefaultCulture(SupportedCultures.English)
                   .AddSupportedCultures(supported.Select(c => c.Name).ToArray())
                   .AddSupportedUICultures(supported.Select(c => c.Name).ToArray());
            options.ApplyCurrentCultureToResponseHeaders = true;
        });

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = config.GetConnectionString("Redis");
            options.InstanceName = "Pinterest_";
        });

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(CachingBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(CacheInvalidationBehavior<,>));
        });
        #endregion

        #region SignalR
        services.AddSignalR(options =>
        {
            options.EnableDetailedErrors = builder.Environment.IsDevelopment();
        })
        .AddJsonProtocol(options =>
        {
            options.PayloadSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        });
        #endregion

        #region Controllers
        services.AddControllers(options =>
        {
            options.ModelBinderProviders.Insert(0, new OptionalBinderProvider());
        })
        .ConfigureApiBehaviorOptions(options =>
        {
            options.SuppressModelStateInvalidFilter = true;
        });

        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());
        #endregion

        #region CORS
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.WithOrigins("http://localhost:5173", "https://max.itstep.click")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });
        #endregion

        #region Quartz (Jobs)
        services.AddQuartz(q =>
        {
            var jobKey = new JobKey(nameof(DbSeedJob));
            q.AddJob<DbSeedJob>(opts => opts.WithIdentity(jobKey));

            q.AddTrigger(opts => opts
                .ForJob(jobKey)
                .WithIdentity($"{nameof(DbSeedJob)}-trigger")
                .StartNow());

            q.AddJob<SendEmailJob>(opts => opts
                .WithIdentity(nameof(SendEmailJob))
                .StoreDurably()); 
        });

        services.AddQuartzHostedService(opt =>
        {
            opt.WaitForJobsToComplete = true;
        });
        #endregion

        #region Application services
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<ITagRepository, TagRepository>();
        services.AddScoped<IFollowRepository, FollowRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ILikeRepository, LikeRepository>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<IReportRepository, ReportRepository>();
        services.AddScoped<IUserBlockRepository, UserBlockRepository>();
        services.AddScoped<IBoardRepository, BoardRepository>();
        services.AddScoped<IBoardPinRepository, BoardPinRepository>();
        services.AddScoped<IBoardSectionRepository, BoardSectionRepository>();
        services.AddScoped<IPinRepository, PinRepository>();
        services.AddScoped<IChatRepository, ChatRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();

        services.AddScoped<IEmailJobScheduler, EmailJobScheduler>();

        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IDbSeederService, DbSeederService>();
        services.AddScoped<ISmtpService, SmtpService>();
        services.AddScoped<IPagedService, PagedService>();
        services.AddScoped<ICookieService, CookieService>();

        services.AddSingleton<IChatNotifier, SignalRChatNotifier>();
        #endregion

        #region Mappers
        services.AddSingleton<BoardMapper>();
        services.AddSingleton<CategoryMapper>();
        services.AddSingleton<CommentMapper>();
        services.AddSingleton<PinMapper>();
        services.AddSingleton<ReportMapper>();
        services.AddSingleton<TagMapper>();
        services.AddSingleton<UserMapper>();
        services.AddSingleton<SeederMapper>();
        services.AddSingleton<ChatMapper>();
        services.AddSingleton<MessageMapper>();
        #endregion

        #region OpenAPI
        services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer((document, context, _) =>
            {
                document.Components ??= new OpenApiComponents();
                document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();

                document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Name = "Authorization"
                };

                document.Security =
                [
                    new OpenApiSecurityRequirement
                    {
                        { new OpenApiSecuritySchemeReference("Bearer"), [] }
                    }
                ];

                document.SetReferenceHostDocument();
                return Task.CompletedTask;
            });

            options.AddSchemaTransformer((schema, context, _) =>
            {
                var type = context.JsonTypeInfo.Type;

                var bindNeverPropNames = type.GetProperties()
                    .Where(p => p.GetCustomAttributes(typeof(BindNeverAttribute), true).Any())
                    .Select(p =>
                    {
                        var jsonAttr = p.GetCustomAttribute<JsonPropertyNameAttribute>();
                        return jsonAttr?.Name ?? char.ToLower(p.Name[0]) + p.Name[1..];
                    })
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                if (bindNeverPropNames.Count > 0 && schema.Properties != null)
                {
                    foreach (var key in schema.Properties.Keys
                        .Where(k => bindNeverPropNames.Contains(k))
                        .ToList())
                    {
                        schema.Properties.Remove(key);
                        schema.Required?.Remove(key);
                    }
                }

                return Task.CompletedTask;
            });
        });
        #endregion

        return builder;
    }
}