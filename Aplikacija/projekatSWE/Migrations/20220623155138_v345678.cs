using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projekatSWE.Migrations
{
    public partial class v345678 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Komentari",
                columns: table => new
                {
                    idKomentara = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tekst = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    datumPostavljanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    KomentarProfaCID = table.Column<int>(type: "int", nullable: true),
                    KomentarStudentCID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Komentari", x => x.idKomentara);
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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Komentari");
        }
    }
}
