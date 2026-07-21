using Application.Common;
using Application.Common.Exceptions;
using Application.Interfaces.Notifiers;
using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Commands;
using Domain.Entities.Comment;
using Domain.Events;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class CreateCommentCommandHandler(
    ICommentRepository commentRepository,
    IPinRepository pinRepository,
    IUserRepository userRepository,
    IMediator mediator,
    ICommentNotifier commentNotifier)
    : IRequestHandler<CreateCommentCommand, CommentResponseDTO>
{
    public async Task<CommentResponseDTO> Handle(CreateCommentCommand request, CancellationToken ct)
    {
        var comment = await commentRepository.AddAsync(new CommentEntity
        {
            UserId = request.UserId,
            PinId = request.PinId,
            Text = request.Text,
            ParentCommentId = request.ParentCommentId
        }, ct);

        var pin = await pinRepository.GetByIdAsync(request.PinId, ct)
            ?? throw new NotFoundException("Пін не знайдено");

        var commenter = await userRepository.GetByIdAsync(request.UserId, ct)
            ?? throw new NotFoundException("Користувача не знайдено");

        await mediator.Publish(new DomainEventNotification<CommentAddedEvent>(
            new CommentAddedEvent(
                request.UserId,
                pin.CreatorId,
                pin.Id,
                commenter.UserName!,
                commenter.Image,
                pin.Title!
            )
        ), ct);

        var response = new CommentResponseDTO
        {
            Id = comment.Id,
            PinId = comment.PinId,
            UserId = comment.UserId,
            Text = comment.Text,
            CreatedAt = comment.CreatedAt,
            ParentCommentId = comment.ParentCommentId,
            Username = commenter.UserName!,
            UserImage = commenter.Image ?? string.Empty
        };

        await commentNotifier.NotifyCreatedAsync(comment.PinId, response);
        return response;
    }
}
