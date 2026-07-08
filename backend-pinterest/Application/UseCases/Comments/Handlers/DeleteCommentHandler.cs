using Application.Common.Exceptions;
using Application.UseCases.Comments.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class DeleteCommentHandler(
    ICommentRepository repository) : IRequestHandler<DeleteCommentCommand, Unit>
{
    public async Task<Unit> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await repository.GetByIdAsync(request.CommentId, cancellationToken)
            ?? throw new NotFoundException("Коментар не знайдено");

        if (comment.UserId != request.UserId)
        {
            throw new ForbiddenException("Ви не можете видалити цей коментар");
        }

        await repository.DeleteAsync(request.CommentId, cancellationToken);
        return Unit.Value;
    }
}