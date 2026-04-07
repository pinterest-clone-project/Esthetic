using Application.Common.Exceptions;
using Application.Common.Validators;
using Domain.Exceptions;
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
            ValidationException => (400, ValidationMessages.ErrorValidation),
            BadRequestException => (400, ValidationMessages.ErrorBadRequest),
            UnauthorizedException => (401, ValidationMessages.ErrorUnauthorized),
            NotFoundException => (404, ValidationMessages.ErrorNotFound),
            DomainException => (422, ValidationMessages.ErrorDomain),
            _ => (500, ValidationMessages.ErrorInternal)
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
