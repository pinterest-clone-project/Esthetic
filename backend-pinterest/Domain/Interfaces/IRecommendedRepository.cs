using Domain.Entities.Recommended;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Interfaces;

public interface IRecommendedRepository
{
    Task<List<UserPinInteraction>> GetAllByUserAsync(Guid UserId,CancellationToken ct = default);
    Task<UserPinInteraction> GetByUserPerPinAsync(Guid UserId, Guid PinId,CancellationToken ct = default);
    Task AddAsync(UserPinInteraction entity, CancellationToken ct = default);
    Task UpdateAsync(UserPinInteraction entity, CancellationToken ct = default);
}
