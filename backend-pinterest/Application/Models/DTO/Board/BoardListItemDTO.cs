using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Models.DTO.Board;

public record BoardListItemDTO
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? CoverImageUrl { get; init; }
    public bool IsPrivate { get; init; }
    public bool IsArchived { get; init; }
    public int PinsCount { get; init; }
    public DateTime CreatedAt { get; init; }
}
