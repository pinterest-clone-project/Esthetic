using Application.Common.Exceptions;
using Application.Interfaces.Notifiers;
using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class UpdateCommentHandler(
    ICommentRepository commentRepository,
    IUserRepository userRepository,
    ICommentNotifier commentNotifier) : IRequestHandler<UpdateCommentCommand, CommentResponseDTO>
{
    public async Task<CommentResponseDTO> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await commentRepository.GetByIdAsync(request.CommentId, cancellationToken)
            ?? throw new NotFoundException("Коментар не знайдено");

        if (comment.UserId != request.UserId)
        {
            throw new ForbiddenException("Ви не можете редагувати цей коментар");
        }

        comment.Text = request.Text;
        await commentRepository.UpdateAsync(comment, cancellationToken);

        var user = await userRepository.GetByIdAsync(comment.UserId, cancellationToken)
            ?? throw new NotFoundException("Користувача не знайдено");

        var response = new CommentResponseDTO
        {
            Id = comment.Id,
            PinId = comment.PinId,
            UserId = comment.UserId,
            Text = comment.Text,
            CreatedAt = comment.CreatedAt,
            ParentCommentId = comment.ParentCommentId,
            Username = user.UserName!,
            UserImage = user.Image ?? string.Empty
        };

        await commentNotifier.NotifyUpdatedAsync(comment.PinId, response);
        return response;
    }
}
