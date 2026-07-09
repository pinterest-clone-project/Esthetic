using Application.Interfaces;
using Application.Models.DTO;
using Application.Models.DTO.Category;
using Application.UseCases.Categories.Extensions;
using Application.UseCases.Categories.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Categories.Handlers;

public class SearchCategoriesHandler(
    ICategoryRepository categoryRepository,
    IPagedService pagedService) : IRequestHandler<SearchCategoriesQuery, PagedResult<CategoryDTO>>
{
    public async Task<PagedResult<CategoryDTO>> Handle(SearchCategoriesQuery request, CancellationToken cancellationToken)
    {
        var q = categoryRepository.GetQueryable()
            .ApplyFilters(request)
            .ApplySorting(request);

        return await pagedService.GetPagedAsync(
            q,
            c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                Image = c.Image,
                PinsCount = c.Pins!.Count
            },
            request.Page,
            request.PageSize,
            cancellationToken
        );
    }
}