using System.ComponentModel;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.Common.Optional;

public class OptionalBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var optionalType = bindingContext.ModelType; // Optional<T>
        var innerType = optionalType.GetGenericArguments()[0]; // T

        var result = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);

        if (result == ValueProviderResult.None)
        {
            bindingContext.Result = ModelBindingResult.Success(Invoke(optionalType, "Undefined"));
            return Task.CompletedTask;
        }

        // Колекції (List<T>) — треба зібрати ВСІ значення, а не лише перше
        if (innerType.IsGenericType && innerType.GetGenericTypeDefinition() == typeof(List<>))
        {
            var elementType = innerType.GetGenericArguments()[0];
            var values = result.Values
                .Where(v => !string.IsNullOrEmpty(v))
                .ToList();

            if (values.Count == 0)
            {
                bindingContext.Result = ModelBindingResult.Success(Invoke(optionalType, "Clear"));
                return Task.CompletedTask;
            }

            var listType = typeof(List<>).MakeGenericType(elementType);
            var list = (System.Collections.IList)Activator.CreateInstance(listType)!;
            var converter = TypeDescriptor.GetConverter(elementType);

            foreach (var raw in values)
                list.Add(converter.ConvertFromInvariantString(raw!)!);

            bindingContext.Result = ModelBindingResult.Success(Invoke(optionalType, "From", list));
            return Task.CompletedTask;
        }

        // Прості типи (string, int, Guid, bool тощо)
        var rawValue = result.FirstValue;

        if (string.IsNullOrEmpty(rawValue) || rawValue == "null")
        {
            bindingContext.Result = ModelBindingResult.Success(Invoke(optionalType, "Clear"));
            return Task.CompletedTask;
        }

        var simpleConverter = TypeDescriptor.GetConverter(innerType);
        var convertedValue = innerType == typeof(string)
            ? rawValue
            : simpleConverter.ConvertFromInvariantString(rawValue)!;

        bindingContext.Result = ModelBindingResult.Success(Invoke(optionalType, "From", convertedValue));
        return Task.CompletedTask;
    }

    private static object Invoke(Type optionalType, string methodName, object? arg = null)
    {
        var method = arg == null
            ? optionalType.GetMethod(methodName, Type.EmptyTypes)!
            : optionalType.GetMethod(methodName, [arg.GetType().IsGenericType ? optionalType.GetGenericArguments()[0] : arg.GetType()])
              ?? optionalType.GetMethod(methodName)!; // fallback

        return method.Invoke(null, arg == null ? null : [arg])!;
    }
}