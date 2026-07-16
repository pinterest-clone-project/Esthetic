using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using backend_pinterest.Hubs;
using Microsoft.Extensions.FileProviders;
using Serilog;

namespace backend_pinterest.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication ConfigureApplication(this WebApplication app)
    {

        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();

        var config = app.Configuration;

        #region CORS
        app.UseCors("AllowAll");
        #endregion

        #region Static files (Images)
        var dir = config["ImagesDir"];
        if (!string.IsNullOrEmpty(dir))
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), dir);
            Directory.CreateDirectory(path);

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(path),
                RequestPath = $"/{dir}",
                OnPrepareResponse = ctx =>
                {
                    var origin = ctx.Context.Request.Headers.Origin.ToString();
                    if (origin == "http://localhost:5173" || origin == "https://max.itstep.click")
                    {
                        ctx.Context.Response.Headers["Access-Control-Allow-Origin"] = origin;
                    }
                }
            });
        }
        #endregion

        #region OpenAPI + Swagger
        app.MapOpenApi();

        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/openapi/v1.json", "v1");
            options.OAuthUsePkce();
        });
        #endregion

        #region Middleware
        app.UseSerilogRequestLogging();

        app.UseExceptionHandler();

        app.UseRequestLocalization();

        //app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.MapHub<ChatHub>("/hubs/chat");
        app.MapHub<CommentHub>("/hubs/comments");
        #endregion

        return app;
    }
}