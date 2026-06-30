using Application.Models.DTO.User;
using MediatR;

namespace Application.UseCases.Users.Commands;

public record AdminUnblockUserCommand(Guid Id) : IRequest<UserDTO>;