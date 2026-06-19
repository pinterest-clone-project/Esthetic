using Domain.Events;
using MediatR;

namespace Application.Common;

public record DomainEventNotification<TEvent>(TEvent Event)
    : INotification where TEvent : IDomainEvent;