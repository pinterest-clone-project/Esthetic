using MediatR;
using Domain.Interfaces;
using Application.UseCases.Users.Queries;
using AutoMapper;
using Application.Models.DTO.User;

namespace Application.UseCases.Users.Handlers;

public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, List<UserDTO>>
{
    private readonly IUserRepository _repo;
    private readonly IMapper _mapper;
    public GetAllUsersHandler(IUserRepository repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);

    public async Task<List<UserDTO>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _repo.GetAllAsync();
        return _mapper.Map<List<UserDTO>>(users);
    }
}
