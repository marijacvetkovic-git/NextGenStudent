using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projekatSWE.Migrations
{
    public partial class v909090 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Prijave",
                columns: table => new
                {
                    idPrijave = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Razlog = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UsernamePrijavljenog = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UsernameKoJe = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    provereno = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prijave", x => x.idPrijave);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Prijave");
        }
    }
}
