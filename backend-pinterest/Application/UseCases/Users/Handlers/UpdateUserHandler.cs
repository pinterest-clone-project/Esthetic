using MediatR;
using Domain.Interfaces;
using Domain.Entities.Identity;
using Application.UseCases.Users.Commands;
using AutoMapper;

namespace Application.UseCases.Users.Handlers;

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, Unit>
{
    private readonly IUserRepository _repo;
    private readonly IMapper _mapper;
    public UpdateUserHandler(IUserRepository repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);

    public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _repo.GetByIdAsync(request.Id);
        if (user == null) throw new KeyNotFoundException("User not found");

        _mapper.Map(request.Request, user);

        await _repo.UpdateAsync(user);
        return Unit.Value;
    }
}
