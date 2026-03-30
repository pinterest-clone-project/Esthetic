using Application.UseCases.Users.Dto;
using MediatR;

namespace Application.UseCases.Users.Queries;

public record GetAllUsersQuery() : IRequest<List<UserDto>>;
