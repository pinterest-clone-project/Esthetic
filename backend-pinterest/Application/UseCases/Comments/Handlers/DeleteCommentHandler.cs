using Application.UseCases.Comments.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class DeleteCommentHandler(
    ICommentRepository repository) : IRequestHandler<DeleteCommentCommand, Unit>
{
    public async Task<Unit> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        await repository.DeleteAsync(request.CommentId, cancellationToken);
        return Unit.Value;
    }
}