using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projekatSWE.Migrations
{
    public partial class V3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Ime",
                table: "Clanovi",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prezime",
                table: "Clanovi",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ime",
                table: "Clanovi");

            migrationBuilder.DropColumn(
                name: "Prezime",
                table: "Clanovi");
        }
    }
}
