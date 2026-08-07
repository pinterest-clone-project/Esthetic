

using Application.Models.DTO.BoardSection;
using MediatR;

namespace Application.UseCases.BoardSections.Queries;

public record GetBoardSectionsQuery(Guid BoardId,
    Guid? CurrentUserId = null) : IRequest<List<BoardSectionDTO>>;
