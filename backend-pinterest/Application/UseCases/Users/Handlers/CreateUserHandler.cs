using MediatR;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Application.UseCases.Users.Commands;
using AutoMapper;
using Application.Models.DTO.User;

namespace Application.UseCases.Users.Handlers;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, UserDTO>
{
    private readonly IUserRepository _repo;
    private readonly IMapper _mapper;
    public CreateUserHandler(IUserRepository repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);

    public async Task<UserDTO> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = _mapper.Map<UserEntity>(request);
        var created = await _repo.AddAsync(user);
        return _mapper.Map<UserDTO>(created);
    }
}
