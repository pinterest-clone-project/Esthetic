

using Domain.Entities.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

[Table("tbl_tags")]
public class TagEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
}
