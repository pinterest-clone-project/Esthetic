
using Application.Models.DTO.Tag;
using MediatR;

namespace Application.UseCases.Tags.Commands;

public record CreateTagCommand(CreateTagDTO Model) : IRequest<TagDTO>
{
}
