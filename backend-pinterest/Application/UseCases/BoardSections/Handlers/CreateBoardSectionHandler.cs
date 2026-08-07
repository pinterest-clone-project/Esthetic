

using Application.Mappers;
using Application.Models.DTO.BoardSection;
using Application.UseCases.BoardSections.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.BoardSections.Handlers;

public class CreateBoardSectionHandler(IBoardRepository boardRepository,
    IBoardSectionRepository boardSectionRepository,
    BoardSectionMapper mapper) : IRequestHandler<CreateBoardSectionCommand, BoardSectionDTO>
{
    public async Task<BoardSectionDTO> Handle(CreateBoardSectionCommand request, CancellationToken cancellationToken)
    {
        var board = await boardRepository.GetByIdAsync(request.BoardId,
            cancellationToken);


        var section = mapper.ToEntity(request);

        section.BoardId = board!.Id;

        var createdSection = await boardSectionRepository.AddAsync(section, cancellationToken);

        return mapper.ToDto(createdSection);
    }
    
}
