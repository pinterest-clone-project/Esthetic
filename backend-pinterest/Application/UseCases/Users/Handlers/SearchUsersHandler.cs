using Application.Interfaces;
using Application.Models.DTO;
using Application.Models.DTO.User;
using Application.UseCases.Users.Extensions;
using Application.UseCases.Users.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Users.Handlers;

public class SearchUsersHandler(
    IUserRepository userRepository,
    IPagedService pagedService) : IRequestHandler<SearchUsersQuery, PagedResult<UserDTO>>
{
    public async Task<PagedResult<UserDTO>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
    {
        var q = userRepository.GetQueryable()
            .ApplyFilters(request)
            .ApplySorting(request);

        return await pagedService.GetPagedAsync(
            q,
            u => new UserDTO
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Bio = u.Bio,
                Image = u.Image,
                IsPrivate = u.IsPrivate,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            },
            request.Page,
            request.PageSize,
            cancellationToken
        );
    }
}
