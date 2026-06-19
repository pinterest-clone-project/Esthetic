using Application.Common;
using Application.Common.Exceptions;
using Application.Mappers;
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
    CommentMapper mapper)
    : IRequestHandler<CreateCommentCommand, CommentDTO>
{
    public async Task<CommentDTO> Handle(CreateCommentCommand request, CancellationToken ct)
    {
        var comment = await commentRepository.AddAsync(new CommentEntity
        {
            UserId = request.UserId,
            PinId = request.PinId,
            Text = request.Text
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

        return mapper.ToDto(comment);
    }
}