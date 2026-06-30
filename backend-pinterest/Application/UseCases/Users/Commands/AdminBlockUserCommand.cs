using Application.Models.DTO.User;
using MediatR;

namespace Application.UseCases.Users.Commands;

public record AdminBlockUserCommand(Guid Id, string Reason) : IRequest<UserDTO>;