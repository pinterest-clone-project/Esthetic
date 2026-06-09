using Application.Mappers;
using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class CreateCommentHandler(
    ICommentRepository repository,
    CommentMapper commentMapper) : IRequestHandler<CreateCommentCommand, CommentDTO>
{
    public async Task<CommentDTO> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = commentMapper.ToEntity(request);
        var created = await repository.AddAsync(comment);
        return commentMapper.ToDto(created);
    }
}