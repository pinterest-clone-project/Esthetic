using Application.Interfaces.Caching;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Categories.Commands;

public record DeleteCategoryCommand(Guid Id) : IRequest<Unit>, ICacheInvalidator
{
    [BindNever]
    public IReadOnlyList<string> CacheKeysInvalidators =>
    [
        CacheKeys.AllCategories,
    ];
}