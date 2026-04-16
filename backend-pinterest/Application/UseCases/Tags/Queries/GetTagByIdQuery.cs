
using Application.Models.DTO.Tag;
using MediatR;

namespace Application.UseCases.Tags.Queries;

public record GetTagByIdQuery(Guid id) : IRequest<TagDTO?>;