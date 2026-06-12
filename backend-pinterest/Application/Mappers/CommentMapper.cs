using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Commands;
using Domain.Entities.Comment;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class CommentMapper
{
    public partial CommentEntity ToEntity(CreateCommentCommand src);
    public partial CommentDTO ToDto(CommentEntity src);
}