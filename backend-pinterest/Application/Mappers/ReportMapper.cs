using Application.Models.DTO.Report;
using AutoMapper;
using Domain.Entities.Report;

namespace Application.Mappers;

public class ReportMapper : Profile
{
    public ReportMapper()
    {
        CreateMap<ReportEntity, ReportDTO>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
    }
}
