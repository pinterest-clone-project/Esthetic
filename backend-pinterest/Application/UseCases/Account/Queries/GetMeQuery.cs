using Application.Models.DTO.User;
using MediatR;

namespace Application.UseCases.Account.Queries;

public record GetMeQuery(Guid UserId) : IRequest<UserDTO>;