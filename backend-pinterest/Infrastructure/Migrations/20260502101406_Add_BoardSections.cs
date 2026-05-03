using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Add_BoardSections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SectionId",
                table: "BoardPins",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "BoardSections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    BoardId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoardSections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BoardSections_Boards_BoardId",
                        column: x => x.BoardId,
                        principalTable: "Boards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BoardPins_SectionId",
                table: "BoardPins",
                column: "SectionId");

            migrationBuilder.CreateIndex(
                name: "IX_BoardSections_BoardId",
                table: "BoardSections",
                column: "BoardId");

            migrationBuilder.AddForeignKey(
                name: "FK_BoardPins_BoardSections_SectionId",
                table: "BoardPins",
                column: "SectionId",
                principalTable: "BoardSections",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BoardPins_BoardSections_SectionId",
                table: "BoardPins");

            migrationBuilder.DropTable(
                name: "BoardSections");

            migrationBuilder.DropIndex(
                name: "IX_BoardPins_SectionId",
                table: "BoardPins");

            migrationBuilder.DropColumn(
                name: "SectionId",
                table: "BoardPins");
        }
    }
}
