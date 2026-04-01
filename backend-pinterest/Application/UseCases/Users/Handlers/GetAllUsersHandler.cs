using MediatR;
using Domain.Interfaces;
using Application.UseCases.Users.Queries;
using AutoMapper;
using Application.UseCases.Users.Responses;

namespace Application.UseCases.Users.Handlers;

public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, List<UserResponse>>
{
    private readonly IUserRepository _repo;
    private readonly IMapper _mapper;
    public GetAllUsersHandler(IUserRepository repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);

    public async Task<List<UserResponse>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _repo.GetAllAsync();
        return _mapper.Map<List<UserResponse>>(users);
    }
}
