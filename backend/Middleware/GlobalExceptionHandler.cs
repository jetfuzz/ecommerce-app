using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace backend.Middleware
{
    public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken
        )
        {
            logger.LogError(
                exception,
                "Unhandled exception occurred. TraceId: {TraceId}",
                httpContext.TraceIdentifier
            );

            var (statusCode, message) = exception switch
            {
                KeyNotFoundException => (StatusCodes.Status404NotFound, exception.Message),
                UnauthorizedAccessException => (
                    StatusCodes.Status401Unauthorized,
                    exception.Message
                ),
                _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred."),
            };

            httpContext.Response.StatusCode = statusCode;
            httpContext.Response.ContentType = "application/json";

            var errorResponse = new { Status = statusCode, Message = message };

            await httpContext.Response.WriteAsJsonAsync(errorResponse, cancellationToken);
            return true;
        }
    }
}
