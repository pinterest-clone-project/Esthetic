using Application.Models.DTO.User;
using MediatR;

namespace Application.UseCases.Account.Commands;

public record RefreshCommand(string RefreshToken) : IRequest<TokenDTO>;