using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Models.DTO.Board;

public class BoardDTO
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? CoverImageUrl { get; init; }
    public bool IsPrivate { get; init; }
    public bool IsArchived { get; init; }
    public Guid OwnerId { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }

    public int PinsCount { get; init; }
}

