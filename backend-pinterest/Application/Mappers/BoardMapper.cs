using Application.Models.DTO.Board;
using Application.UseCases.Boards.Commands;
using AutoMapper;
using Domain.Entities.Board;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Mappers;

public class BoardMapper : Profile
{
    public BoardMapper()
    {

        CreateMap<BoardEntity, BoardDTO>()
            .ForMember(dest => dest.PinsCount,
                opt => opt.MapFrom(src => src.BoardPins.Count));

        CreateMap<BoardEntity, BoardListItemDTO>()
            .ForMember(dest => dest.PinsCount,
                opt => opt.MapFrom(src => src.BoardPins.Count));

        CreateMap<BoardEntity, BoardDetailsDTO>()
            .ForMember(dest => dest.PinsCount,
                opt => opt.MapFrom(src => src.BoardPins.Count))
            .ForMember(dest => dest.PreviewImageUrls,
                opt => opt.MapFrom(src => src.BoardPins
                    .OrderByDescending(bp => bp.CreatedAt)
                    .Take(4)
                    .Select(bp => bp.Pin.MediaUrl)
                    .Where(url => url != null)
                    .ToList()));

        CreateMap<CreateBoardCommand, BoardEntity>();

        CreateMap<UpdateBoardCommand, BoardEntity>()
        .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

    }
}
