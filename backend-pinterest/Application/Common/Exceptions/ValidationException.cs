using FluentValidation.Results;

namespace Application.Common.Exceptions;

public class ValidationException : Exception
{
    public ValidationException(IEnumerable<ValidationFailure> failures)
    {
        Errors = failures
            .GroupBy(f => f.PropertyName)
            .ToDictionary(
                group => group.Key,
                group => group.Select(f => f.ErrorMessage).ToArray()
            );
    }

    public IDictionary<string, string[]> Errors { get; }
}