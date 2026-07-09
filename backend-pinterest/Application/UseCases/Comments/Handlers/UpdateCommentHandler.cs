using Application.Common.Exceptions;
using Application.Mappers;
using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Commands;
using Domain.Entities.Comment;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class UpdateCommentHandler(
    ICommentRepository commentRepository,
    CommentMapper mapper) : IRequestHandler<UpdateCommentCommand, CommentDTO>
{
    public async Task<CommentDTO> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await commentRepository.GetByIdAsync(request.CommentId, cancellationToken)
            ?? throw new NotFoundException("Коментар не знайдено");

        if (comment.UserId != request.UserId)
        {
            throw new ForbiddenException("Ви не можете редагувати цей коментар");
        }

        comment.Text = request.Text;
        await commentRepository.UpdateAsync(comment, cancellationToken);

        return mapper.ToDto(comment);
    }
}
