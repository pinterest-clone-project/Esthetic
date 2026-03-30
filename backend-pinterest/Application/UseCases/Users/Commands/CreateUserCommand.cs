using MediatR;
using Application.UseCases.Users.Dto;
using Application.UseCases.Users.Requests;

namespace Application.UseCases.Users.Commands;

public record CreateUserCommand(CreateUserRequest Request) : IRequest<UserDto>;
