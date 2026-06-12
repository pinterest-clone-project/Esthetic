using Application.Models.DTO.Report;
using Application.UseCases.Reports.Commands;
using Domain.Entities.Report;
using Domain.Enums;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class ReportMapper
{
    [MapperIgnoreTarget(nameof(ReportDTO.Status))]
    private partial ReportDTO ToDtoInternal(ReportEntity src);

    [MapperIgnoreTarget(nameof(ReportEntity.Status))]
    private partial ReportEntity ToEntityInternal(CreateReportCommand src);

    public ReportDTO ToDto(ReportEntity src)
    {
        var dto = ToDtoInternal(src);
        dto.Status = src.Status.ToString();
        return dto;
    }

    public ReportEntity ToEntity(CreateReportCommand src)
    {
        var entity = ToEntityInternal(src);
        entity.Status = ReportStatus.Pending;
        return entity;
    }
}