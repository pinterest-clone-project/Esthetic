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

    [MapProperty(nameof(CommentEntity.User.UserName), nameof(CommentResponseDTO.Username))]
    [MapProperty(nameof(CommentEntity.User.Image), nameof(CommentResponseDTO.UserImage))]
    [MapProperty(nameof(CommentEntity.ParentCommentId), nameof(CommentResponseDTO.ParentCommentId))]
    [MapperIgnoreTarget(nameof(CommentResponseDTO.Reactions))]
    [MapperIgnoreTarget(nameof(CommentResponseDTO.MyReaction))]
    [MapperIgnoreTarget(nameof(CommentResponseDTO.Replies))]
    public partial CommentResponseDTO ToResponseDto(CommentEntity src);
}
