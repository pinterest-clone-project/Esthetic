using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Commands;
using AutoMapper;
using Domain.Entities.Comment;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class CreateCommentHandler(
    ICommentRepository repository,
    IMapper mapper) : IRequestHandler<CreateCommentCommand, CommentDTO>
{
    public async Task<CommentDTO> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = mapper.Map<CommentEntity>(request);
        var created = await repository.AddAsync(comment);
        return mapper.Map<CommentDTO>(created);
    }
}