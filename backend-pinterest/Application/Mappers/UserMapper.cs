using Application.Models.DTO;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using Application.UseCases.Users.Commands;
using Domain.Entities.Identity;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class UserMapper
{
    [MapperIgnoreTarget(nameof(UserDTO.CategoryIds))]
    private partial UserDTO ToDtoInternal(UserEntity src);

    public UserDTO ToDto(UserEntity src)
    {
        var dto = ToDtoInternal(src);
        dto.CategoryIds = src.UserCategories?.Select(uc => uc.CategoryId).ToList() ?? [];
        return dto;
    }

    public partial UserEntity ToEntity(CreateUserCommand src);
    public partial UserEntity ToEntity(UpdateUserCommand src);
    public partial UserEntity ToEntity(RegisterCommand src);
    public partial UserShortDTO ToShortDTO(UserEntity entity);

    [MapProperty(nameof(GoogleAccountModel.Email), nameof(UserEntity.UserName))]
    [MapperIgnoreTarget(nameof(UserEntity.FirstName))]
    [MapperIgnoreTarget(nameof(UserEntity.LastName))]
    [MapperIgnoreTarget(nameof(UserEntity.Image))]
    private partial UserEntity GoogleToEntityInternal(GoogleAccountModel src);

    public UserEntity ToEntity(GoogleAccountModel src)
    {
        var entity = GoogleToEntityInternal(src);
        entity.FirstName = src.Name.Split(' ', 2)[0];
        entity.LastName = src.Name.Contains(' ') ? src.Name.Split(' ', 2)[1] : null;
        return entity;
    }
    public partial void Patch(UpdateUserCommand src, UserEntity dest);
}