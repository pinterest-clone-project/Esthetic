using Application.UseCases.Users.Requests;
using Application.UseCases.Users.Response;
using MediatR;

namespace Application.UseCases.Users.Commands;

public record CreateUserCommand(CreateUserRequest Request) : IRequest<UserResponse>;
