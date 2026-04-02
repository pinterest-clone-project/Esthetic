using Application.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace Infrastructure.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken ct)
    {
        var (status, title) = exception switch
        {
            ValidationException => (400, "Помилка"),
            UnauthorizedException => (401, "Помилка автентифікації"),
            NotFoundException => (404, "Не знайдено"),
            _ => (500, "Внутрішня помилка сервера")
        };

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";

        if (exception is ValidationException validationEx)
        {
            await context.Response.WriteAsJsonAsync(new
            {
                Status = status,
                Title = title,
                Errors = validationEx.Errors
            }, ct);

            return true;
        }

        await context.Response.WriteAsJsonAsync(new
        {
            Status = status,
            Title = title,
            Detail = exception.Message
        }, ct);

        return true;
    }
}
