using MediatR;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Application.UseCases.Users.Queries;
using Application.UseCases.Users.Dto;
using AutoMapper;

namespace Application.UseCases.Users.Handlers;

public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, UserDto?>
{
    private readonly IUserRepository _repo;
    private readonly IMapper _mapper;
    public GetUserByIdHandler(IUserRepository repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);

    public async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _repo.GetByIdAsync(request.Id);
        if (user == null) return null;
        return _mapper.Map<UserDto>(user);
    }
}
