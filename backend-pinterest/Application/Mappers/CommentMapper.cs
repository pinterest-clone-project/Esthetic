using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Commands;
using AutoMapper;
using Domain.Entities.Comment;

namespace Application.Mappers;

public class CommentMapper : Profile
{
    public CommentMapper()
    {
        CreateMap<CreateCommentCommand, CommentEntity>();
        CreateMap<CommentEntity, CommentDTO>();
    }
}
