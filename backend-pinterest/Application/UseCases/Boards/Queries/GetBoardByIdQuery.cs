using Application.Models.DTO.Board;
using MediatR;

namespace Application.UseCases.Boards.Queries;

public record GetBoardByIdQuery(Guid Id) : IRequest<BoardDetailsDTO>;