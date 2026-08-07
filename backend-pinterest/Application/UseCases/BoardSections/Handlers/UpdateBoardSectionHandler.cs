
using Application.Mappers;
using Application.Models.DTO.BoardSection;
using Application.UseCases.BoardSections.Commands;
using Domain.Interfaces;
using MediatR;
using Application.Common.Exceptions;
using Application.Common.Validators;

namespace Application.UseCases.BoardSections.Handlers;

public class UpdateBoardSectionHandler(IBoardSectionRepository boardSectionRepository,
    IBoardRepository boardRepository,
    BoardSectionMapper mapper)
    : IRequestHandler<UpdateBoardSectionCommand, BoardSectionDTO>
{
    public async Task<BoardSectionDTO> Handle(UpdateBoardSectionCommand request,
        CancellationToken cancellationToken)
    {
        var section = await boardSectionRepository.GetByIdAsync(request.Id,
            cancellationToken) ?? throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.BoardSection));

        var board = await boardRepository.GetByIdAsync(section.BoardId, cancellationToken)
            ?? throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.Board));

        if (board.OwnerId != request.OwnerId)
            throw new UnauthorizedException(ValidationMessages.BoardUpdateOwnBoards);

        mapper.Patch(request, section);

        await boardSectionRepository.UpdateAsync(section, cancellationToken);

        return mapper.ToDto(section);
    }
}
