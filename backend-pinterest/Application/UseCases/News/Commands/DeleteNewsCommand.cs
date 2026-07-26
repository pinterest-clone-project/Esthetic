using MediatR;

namespace Application.UseCases.News.Commands;

public record DeleteNewsCommand(Guid Id) : IRequest;
