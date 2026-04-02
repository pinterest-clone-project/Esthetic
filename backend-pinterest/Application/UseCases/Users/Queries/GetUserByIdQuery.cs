using MediatR;
using Application.UseCases.Users.Responses;

namespace Application.UseCases.Users.Queries;

public record GetUserByIdQuery(Guid Id) : IRequest<UserResponse?>;
