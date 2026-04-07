
using Application.Models.DTO.Tag;
using MediatR;

namespace Application.UseCases.Tags.Queries;

public record GetAllTagsQuery() : IRequest<List<TagDTO>>
{
}

