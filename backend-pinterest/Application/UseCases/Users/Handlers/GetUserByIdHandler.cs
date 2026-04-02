using MediatR;
using Domain.Interfaces;
using Application.UseCases.Users.Queries;
using AutoMapper;
using Application.Models.DTO.User;

namespace Application.UseCases.Users.Handlers;

public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, UserDTO?>
{
    private readonly IUserRepository _repo;
    private readonly IMapper _mapper;
    public GetUserByIdHandler(IUserRepository repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);

    public async Task<UserDTO?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _repo.GetByIdAsync(request.Id);
        if (user == null) return null;
        return _mapper.Map<UserDTO>(user);
    }
}
