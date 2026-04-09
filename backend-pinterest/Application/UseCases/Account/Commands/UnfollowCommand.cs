using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.UseCases.Account.Commands;

public record UnfollowCommand : IRequest<Unit>
{
    [BindNever]
    public Guid Id { get; init; }
    public Guid FollowedId { get; init; }
}
