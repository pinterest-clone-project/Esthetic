using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Add_PinTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_pins_AspNetUsers_CreatorId",
                table: "tbl_pins");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_tags",
                table: "tbl_tags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_pins",
                table: "tbl_pins");

            migrationBuilder.RenameTable(
                name: "tbl_tags",
                newName: "Tags");

            migrationBuilder.RenameTable(
                name: "tbl_pins",
                newName: "Pins");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_pins_CreatorId",
                table: "Pins",
                newName: "IX_Pins_CreatorId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tags",
                table: "Tags",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Pins",
                table: "Pins",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "PinTags",
                columns: table => new
                {
                    PinId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PinTags", x => new { x.PinId, x.TagId });
                    table.ForeignKey(
                        name: "FK_PinTags_Pins_PinId",
                        column: x => x.PinId,
                        principalTable: "Pins",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PinTags_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PinTags_TagId",
                table: "PinTags",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pins_AspNetUsers_CreatorId",
                table: "Pins",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pins_AspNetUsers_CreatorId",
                table: "Pins");

            migrationBuilder.DropTable(
                name: "PinTags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tags",
                table: "Tags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Pins",
                table: "Pins");

            migrationBuilder.RenameTable(
                name: "Tags",
                newName: "tbl_tags");

            migrationBuilder.RenameTable(
                name: "Pins",
                newName: "tbl_pins");

            migrationBuilder.RenameIndex(
                name: "IX_Pins_CreatorId",
                table: "tbl_pins",
                newName: "IX_tbl_pins_CreatorId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_tags",
                table: "tbl_tags",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_pins",
                table: "tbl_pins",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_pins_AspNetUsers_CreatorId",
                table: "tbl_pins",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
