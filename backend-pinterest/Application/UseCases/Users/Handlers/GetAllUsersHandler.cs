using MediatR;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Application.UseCases.Users.Queries;
using Application.UseCases.Users.Dto;
using AutoMapper;

namespace Application.UseCases.Users.Handlers;

public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, List<UserDto>>
{
    private readonly IUserRepository _repo;
    private readonly IMapper _mapper;
    public GetAllUsersHandler(IUserRepository repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);

    public async Task<List<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _repo.GetAllAsync();
        return _mapper.Map<List<UserDto>>(users);
    }
}
