using Application.Models.DTO.UserBlock;
using MediatR;

namespace Application.UseCases.UserBlock.Queries;

public record GetBlockedUsersQuery(Guid BlockerId) : IRequest<List<BlockedUserDTO>>;
