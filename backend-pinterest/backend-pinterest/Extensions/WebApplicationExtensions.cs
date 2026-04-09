using Microsoft.Extensions.FileProviders;
using Serilog;

namespace backend_pinterest.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication ConfigureApplication(this WebApplication app)
    {
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
                RequestPath = $"/{dir}"
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

        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        #endregion

        return app;
    }
}