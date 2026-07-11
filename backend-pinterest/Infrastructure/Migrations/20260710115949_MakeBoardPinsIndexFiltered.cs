using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeBoardPinsIndexFiltered : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BoardPins_BoardId_PinId",
                table: "BoardPins");

            migrationBuilder.CreateIndex(
                name: "IX_BoardPins_BoardId_PinId",
                table: "BoardPins",
                columns: new[] { "BoardId", "PinId" },
                unique: true,
                filter: "\"IsDeleted\" = false");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BoardPins_BoardId_PinId",
                table: "BoardPins");

            migrationBuilder.CreateIndex(
                name: "IX_BoardPins_BoardId_PinId",
                table: "BoardPins",
                columns: new[] { "BoardId", "PinId" },
                unique: true);
        }
    }
}
