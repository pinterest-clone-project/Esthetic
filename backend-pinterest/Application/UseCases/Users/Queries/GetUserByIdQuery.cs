using MediatR;
using Application.UseCases.Users.Response;

namespace Application.UseCases.Users.Queries;

public record GetUserByIdQuery(Guid Id) : IRequest<UserResponse?>;
