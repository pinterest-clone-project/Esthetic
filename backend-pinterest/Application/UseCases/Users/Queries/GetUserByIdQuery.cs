using MediatR;
using Application.Models.DTO.User;

namespace Application.UseCases.Users.Queries;

public record GetUserByIdQuery(Guid Id) : IRequest<UserDTO?>;
