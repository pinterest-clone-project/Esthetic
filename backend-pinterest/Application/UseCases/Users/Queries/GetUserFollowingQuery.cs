using Application.Models.DTO.User;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.UseCases.Users.Queries;

public record GetUserFollowingQuery(Guid UserId) : IRequest<List<UserDTO>>;


