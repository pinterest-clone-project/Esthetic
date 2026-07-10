using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

namespace Application.Common.Optional;

public class OptionalBinderProvider : IModelBinderProvider
{
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        var modelType = context.Metadata.ModelType;

        if (modelType.IsGenericType && modelType.GetGenericTypeDefinition() == typeof(Optional<>))
            return new BinderTypeModelBinder(typeof(OptionalBinder));

        return null;
    }
}