
using Application.UseCases.Recommended.Command;
using Domain.Entities.Recommended;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Recommended.Handler;

public class TrackPinViewHandler(IRecommendedRepository repository) : IRequestHandler<TrackPinViewCommand, Unit>
{
    public async Task<Unit> Handle(TrackPinViewCommand command, CancellationToken cancellationToken)
    {
        var interaction = await repository.GetByUserPerPinAsync(command.UserId, command.PinId, cancellationToken);
        if (interaction == null)
        {
            interaction = new UserPinInteraction
            {
                PinId = command.PinId,
                UserId = command.UserId,
                ViewCount = 1,
                LastViewedAt = DateTime.UtcNow
            };
            await repository.AddAsync(interaction, cancellationToken);
        }
        else
        {
            interaction.ViewCount += 1;
            interaction.LastViewedAt = DateTime.UtcNow;

            await repository.UpdateAsync(interaction, cancellationToken);
        }


        return Unit.Value;
    }
}
