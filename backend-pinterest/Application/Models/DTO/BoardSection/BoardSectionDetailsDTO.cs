

using Application.Models.DTO.Pin;

namespace Application.Models.DTO.BoardSection;

public class BoardSectionDetailsDTO
{
    public Guid Id { get; set; }

    public Guid BoardId { get; set; }
    public Guid OwnerId { get; set; }

    public string Title { get; set; } = string.Empty;

    public int PinsCount { get; set; }

    public IReadOnlyList<PinSummaryDTO> Pins { get; set; }
        = new List<PinSummaryDTO>();

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
