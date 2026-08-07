
using Application.Models.DTO.BoardSection;
using MediatR;

namespace Application.UseCases.BoardSections.Queries;

public record GetBoardSectionByIdQuery(Guid Id,
    Guid? CurrentUserId = null) : IRequest<BoardSectionDTO>;
