using Application.Behaviors;
using Application.Common.Validators;
using Application.Interfaces;
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
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Quartz;
using System.Globalization;
using System.Text;

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

        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(CachingBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(CacheInvalidationBehavior<,>));
        });
        #endregion

        #region Controllers
        services.AddControllers()
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
                policy.AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
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

        services.AddScoped<IEmailJobScheduler, EmailJobScheduler>();

        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IDbSeederService, DbSeederService>();
        services.AddScoped<ISmtpService, SmtpService>();
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
        });
        #endregion

        return builder;
    }
}