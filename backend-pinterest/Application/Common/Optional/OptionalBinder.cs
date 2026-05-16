using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.Common.Optional;

public class OptionalBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var result = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);

        if (result == ValueProviderResult.None)
        {
            bindingContext.Result = ModelBindingResult.Success(Optional<string>.Undefined());
            return Task.CompletedTask;
        }

        var raw = result.FirstValue;

        bindingContext.Result = string.IsNullOrEmpty(raw) || raw == "null"
            ? ModelBindingResult.Success(Optional<string>.Clear())
            : ModelBindingResult.Success(Optional<string>.From(raw));

        return Task.CompletedTask;
    }
}
