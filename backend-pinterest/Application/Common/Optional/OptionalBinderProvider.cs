using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

namespace Application.Common.Optional;

public class OptionalBinderProvider : IModelBinderProvider
{
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        if (context.Metadata.ModelType == typeof(Optional<string>))
            return new BinderTypeModelBinder(typeof(OptionalBinder));

        return null;
    }
}
