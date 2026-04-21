using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Pin_Tag_Connection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbl_pin_tags",
                columns: table => new
                {
                    PinsId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_pin_tags", x => new { x.PinsId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_tbl_pin_tags_tbl_pins_PinsId",
                        column: x => x.PinsId,
                        principalTable: "tbl_pins",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbl_pin_tags_tbl_tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "tbl_tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_pin_tags_TagsId",
                table: "tbl_pin_tags",
                column: "TagsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_pin_tags");
        }
    }
}
