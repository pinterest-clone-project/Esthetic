namespace Application.Common.Optional;

public readonly struct Optional<T>
{
    public T? Value { get; }
    public bool HasValue { get; }
    public bool IsCleared { get; }

    private Optional(T? value, bool hasValue, bool isCleared)
    {
        Value = value;
        HasValue = hasValue;
        IsCleared = isCleared;
    }

    public static Optional<T> From(T value) => new(value, hasValue: true, isCleared: false);
    public static Optional<T> Clear() => new(default, hasValue: true, isCleared: true);
    public static Optional<T> Undefined() => new(default, hasValue: false, isCleared: false);

    public T? Apply(T? current) => IsCleared ? default : HasValue ? Value : current;
}
