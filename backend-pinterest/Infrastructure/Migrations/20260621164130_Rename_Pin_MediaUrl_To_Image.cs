using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Rename_Pin_MediaUrl_To_Image : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MediaUrl",
                table: "Pins");

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Pins",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "Pins");

            migrationBuilder.AddColumn<string>(
                name: "MediaUrl",
                table: "Pins",
                type: "text",
                nullable: true);
        }
    }
}
