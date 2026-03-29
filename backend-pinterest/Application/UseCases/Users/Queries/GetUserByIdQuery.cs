using MediatR;
using Application.UseCases.Users.Dto;

namespace Application.UseCases.Users.Queries;

public record GetUserByIdQuery(Guid Id) : IRequest<UserDto?>;
