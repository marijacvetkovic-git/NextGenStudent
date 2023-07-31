using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projekatSWE.Migrations
{
    public partial class v34567 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Komentari");

            migrationBuilder.AddColumn<double>(
                name: "ocenaProsek",
                table: "Clanovi",
                type: "float",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrimaocId = table.Column<int>(type: "int", nullable: false),
                    PosiljaocId = table.Column<int>(type: "int", nullable: false),
                    Tekst = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Vreme = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Ocene",
                columns: table => new
                {
                    idOcene = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ocena = table.Column<int>(type: "int", nullable: false),
                    profCID = table.Column<int>(type: "int", nullable: true),
                    studCID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ocene", x => x.idOcene);
                    table.ForeignKey(
                        name: "FK_Ocene_Clanovi_profCID",
                        column: x => x.profCID,
                        principalTable: "Clanovi",
                        principalColumn: "CID");
                    table.ForeignKey(
                        name: "FK_Ocene_Clanovi_studCID",
                        column: x => x.studCID,
                        principalTable: "Clanovi",
                        principalColumn: "CID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ocene_profCID",
                table: "Ocene",
                column: "profCID");

            migrationBuilder.CreateIndex(
                name: "IX_Ocene_studCID",
                table: "Ocene",
                column: "studCID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "Ocene");

            migrationBuilder.DropColumn(
                name: "ocenaProsek",
                table: "Clanovi");

            migrationBuilder.CreateTable(
                name: "Komentari",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KomentarProfaCID = table.Column<int>(type: "int", nullable: true),
                    KomentarStudentCID = table.Column<int>(type: "int", nullable: true),
                    Komentarcic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rate = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Komentari", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Komentari_Clanovi_KomentarProfaCID",
                        column: x => x.KomentarProfaCID,
                        principalTable: "Clanovi",
                        principalColumn: "CID");
                    table.ForeignKey(
                        name: "FK_Komentari_Clanovi_KomentarStudentCID",
                        column: x => x.KomentarStudentCID,
                        principalTable: "Clanovi",
                        principalColumn: "CID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Komentari_KomentarProfaCID",
                table: "Komentari",
                column: "KomentarProfaCID");

            migrationBuilder.CreateIndex(
                name: "IX_Komentari_KomentarStudentCID",
                table: "Komentari",
                column: "KomentarStudentCID");
        }
    }
}
