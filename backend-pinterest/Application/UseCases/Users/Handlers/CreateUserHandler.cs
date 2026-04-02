using MediatR;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Application.UseCases.Users.Commands;
using AutoMapper;
using Application.UseCases.Users.Responses;

namespace Application.UseCases.Users.Handlers;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, UserResponse>
{
    private readonly IUserRepository _repo;
    private readonly IMapper _mapper;
    public CreateUserHandler(IUserRepository repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);

    public async Task<UserResponse> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = _mapper.Map<UserEntity>(request);
        var created = await _repo.AddAsync(user);
        return _mapper.Map<UserResponse>(created);
    }
}
