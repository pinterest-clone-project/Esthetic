using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Add_Category_Pin_Relationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Source_Url",
                table: "Pins",
                newName: "SourceUrl");

            migrationBuilder.RenameColumn(
                name: "Media_Url",
                table: "Pins",
                newName: "MediaUrl");

            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "Pins",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "AspNetUserLogins",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Pins_CategoryId",
                table: "Pins",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId1",
                table: "AspNetUserLogins",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserLogins_AspNetUsers_UserId1",
                table: "AspNetUserLogins",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Pins_Categories_CategoryId",
                table: "Pins",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserLogins_AspNetUsers_UserId1",
                table: "AspNetUserLogins");

            migrationBuilder.DropForeignKey(
                name: "FK_Pins_Categories_CategoryId",
                table: "Pins");

            migrationBuilder.DropIndex(
                name: "IX_Pins_CategoryId",
                table: "Pins");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUserLogins_UserId1",
                table: "AspNetUserLogins");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Pins");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "AspNetUserLogins");

            migrationBuilder.RenameColumn(
                name: "SourceUrl",
                table: "Pins",
                newName: "Source_Url");

            migrationBuilder.RenameColumn(
                name: "MediaUrl",
                table: "Pins",
                newName: "Media_Url");
        }
    }
}
