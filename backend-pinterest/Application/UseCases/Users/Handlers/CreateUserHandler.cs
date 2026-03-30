using MediatR;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Application.UseCases.Users.Commands;
using Application.UseCases.Users.Dto;
using AutoMapper;

namespace Application.UseCases.Users.Handlers;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, UserDto>
{
    private readonly IUserRepository _repo;
    private readonly IMapper _mapper;
    public CreateUserHandler(IUserRepository repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);

    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = _mapper.Map<UserEntity>(request.Request);
        var created = await _repo.AddAsync(user);
        return _mapper.Map<UserDto>(created);
    }
}
