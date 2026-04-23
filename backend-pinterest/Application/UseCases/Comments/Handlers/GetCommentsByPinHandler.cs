using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Queries;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class GetCommentsByPinHandler(
    ICommentRepository repository,
    IMapper mapper) : IRequestHandler<GetCommentsByPinQuery, List<CommentDTO>>
{
    public async Task<List<CommentDTO>> Handle(GetCommentsByPinQuery request, CancellationToken cancellationToken)
    {
        var comments = await repository.GetByPinIdAsync(request.PinId, cancellationToken);
        return mapper.Map<List<CommentDTO>>(comments);
    }
}