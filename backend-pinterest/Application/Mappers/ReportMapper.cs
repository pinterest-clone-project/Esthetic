using Application.Models.DTO.Report;
using Application.UseCases.Reports.Commands;
using AutoMapper;
using Domain.Entities.Report;
using Domain.Enums;

namespace Application.Mappers;

public class ReportMapper : Profile
{
    public ReportMapper()
    {
        CreateMap<ReportEntity, ReportDTO>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
        CreateMap<CreateReportCommand, ReportEntity>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => ReportStatus.Pending));
    }
}
