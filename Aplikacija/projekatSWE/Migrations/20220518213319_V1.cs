using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projekatSWE.Migrations
{
    public partial class V1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Fakulteti",
                columns: table => new
                {
                    FID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Grad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fakulteti", x => x.FID);
                });

            migrationBuilder.CreateTable(
                name: "Loginovi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Uloga = table.Column<int>(type: "int", nullable: false),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TokenCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TokenExpires = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Loginovi", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rasporedi",
                columns: table => new
                {
                    RID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rasporedi", x => x.RID);
                });

            migrationBuilder.CreateTable(
                name: "Predmeti",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PredmetFakultetFID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Predmeti", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Predmeti_Fakulteti_PredmetFakultetFID",
                        column: x => x.PredmetFakultetFID,
                        principalTable: "Fakulteti",
                        principalColumn: "FID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Clanovi",
                columns: table => new
                {
                    CID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Slika = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Username = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    BrLicneKarte = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Polic = table.Column<int>(type: "int", nullable: false),
                    DatumRodjenja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Banovan = table.Column<bool>(type: "bit", nullable: false),
                    Uloga = table.Column<int>(type: "int", nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Broj = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NastavnoZvanje = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Obrazovanje = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RasporedForeignKey = table.Column<int>(type: "int", nullable: true),
                    Grad = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GodinaStudija = table.Column<int>(type: "int", nullable: true),
                    Studija = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clanovi", x => x.CID);
                    table.ForeignKey(
                        name: "FK_Clanovi_Rasporedi_RasporedForeignKey",
                        column: x => x.RasporedForeignKey,
                        principalTable: "Rasporedi",
                        principalColumn: "RID");
                });

            migrationBuilder.CreateTable(
                name: "Casi",
                columns: table => new
                {
                    CASID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Pocetak = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Zavrsetak = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Cena = table.Column<int>(type: "int", nullable: false),
                    CasPredmetID = table.Column<int>(type: "int", nullable: false),
                    CasRasporedRID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Casi", x => x.CASID);
                    table.ForeignKey(
                        name: "FK_Casi_Predmeti_CasPredmetID",
                        column: x => x.CasPredmetID,
                        principalTable: "Predmeti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Casi_Rasporedi_CasRasporedRID",
                        column: x => x.CasRasporedRID,
                        principalTable: "Rasporedi",
                        principalColumn: "RID");
                });

            migrationBuilder.CreateTable(
                name: "FakultetStudent",
                columns: table => new
                {
                    FakultetStudentCID = table.Column<int>(type: "int", nullable: false),
                    NazivFakultetaFID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FakultetStudent", x => new { x.FakultetStudentCID, x.NazivFakultetaFID });
                    table.ForeignKey(
                        name: "FK_FakultetStudent_Clanovi_FakultetStudentCID",
                        column: x => x.FakultetStudentCID,
                        principalTable: "Clanovi",
                        principalColumn: "CID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FakultetStudent_Fakulteti_NazivFakultetaFID",
                        column: x => x.NazivFakultetaFID,
                        principalTable: "Fakulteti",
                        principalColumn: "FID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Komentari",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Komentarcic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rate = table.Column<int>(type: "int", nullable: false),
                    KomentarProfaCID = table.Column<int>(type: "int", nullable: true),
                    KomentarStudentCID = table.Column<int>(type: "int", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "Oglasi",
                columns: table => new
                {
                    OID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Datum = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentOglasCID = table.Column<int>(type: "int", nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Stan = table.Column<bool>(type: "bit", nullable: true),
                    SlikeStana = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrojCimera = table.Column<int>(type: "int", nullable: true),
                    GodinaStudija = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuddyStudije = table.Column<int>(type: "int", nullable: true),
                    PredmetID = table.Column<int>(type: "int", nullable: true),
                    OglasZaTutora_GodinaStudija = table.Column<int>(type: "int", nullable: true),
                    TutorStudije = table.Column<int>(type: "int", nullable: true),
                    TutorPredmetID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Oglasi", x => x.OID);
                    table.ForeignKey(
                        name: "FK_Oglasi_Clanovi_StudentOglasCID",
                        column: x => x.StudentOglasCID,
                        principalTable: "Clanovi",
                        principalColumn: "CID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Oglasi_Predmeti_PredmetID",
                        column: x => x.PredmetID,
                        principalTable: "Predmeti",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Oglasi_Predmeti_TutorPredmetID",
                        column: x => x.TutorPredmetID,
                        principalTable: "Predmeti",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "ProfIPredmet",
                columns: table => new
                {
                    PredmetProfCID = table.Column<int>(type: "int", nullable: false),
                    ProfPredmetID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfIPredmet", x => new { x.PredmetProfCID, x.ProfPredmetID });
                    table.ForeignKey(
                        name: "FK_ProfIPredmet_Clanovi_PredmetProfCID",
                        column: x => x.PredmetProfCID,
                        principalTable: "Clanovi",
                        principalColumn: "CID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfIPredmet_Predmeti_ProfPredmetID",
                        column: x => x.ProfPredmetID,
                        principalTable: "Predmeti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudenICas",
                columns: table => new
                {
                    CasStudentCID = table.Column<int>(type: "int", nullable: false),
                    StudentCasCASID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudenICas", x => new { x.CasStudentCID, x.StudentCasCASID });
                    table.ForeignKey(
                        name: "FK_StudenICas_Casi_StudentCasCASID",
                        column: x => x.StudentCasCASID,
                        principalTable: "Casi",
                        principalColumn: "CASID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudenICas_Clanovi_CasStudentCID",
                        column: x => x.CasStudentCID,
                        principalTable: "Clanovi",
                        principalColumn: "CID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Casi_CasPredmetID",
                table: "Casi",
                column: "CasPredmetID");

            migrationBuilder.CreateIndex(
                name: "IX_Casi_CasRasporedRID",
                table: "Casi",
                column: "CasRasporedRID");

            migrationBuilder.CreateIndex(
                name: "IX_Clanovi_RasporedForeignKey",
                table: "Clanovi",
                column: "RasporedForeignKey",
                unique: true,
                filter: "[RasporedForeignKey] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_FakultetStudent_NazivFakultetaFID",
                table: "FakultetStudent",
                column: "NazivFakultetaFID");

            migrationBuilder.CreateIndex(
                name: "IX_Komentari_KomentarProfaCID",
                table: "Komentari",
                column: "KomentarProfaCID");

            migrationBuilder.CreateIndex(
                name: "IX_Komentari_KomentarStudentCID",
                table: "Komentari",
                column: "KomentarStudentCID");

            migrationBuilder.CreateIndex(
                name: "IX_Oglasi_PredmetID",
                table: "Oglasi",
                column: "PredmetID");

            migrationBuilder.CreateIndex(
                name: "IX_Oglasi_StudentOglasCID",
                table: "Oglasi",
                column: "StudentOglasCID");

            migrationBuilder.CreateIndex(
                name: "IX_Oglasi_TutorPredmetID",
                table: "Oglasi",
                column: "TutorPredmetID");

            migrationBuilder.CreateIndex(
                name: "IX_Predmeti_PredmetFakultetFID",
                table: "Predmeti",
                column: "PredmetFakultetFID");

            migrationBuilder.CreateIndex(
                name: "IX_ProfIPredmet_ProfPredmetID",
                table: "ProfIPredmet",
                column: "ProfPredmetID");

            migrationBuilder.CreateIndex(
                name: "IX_StudenICas_StudentCasCASID",
                table: "StudenICas",
                column: "StudentCasCASID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FakultetStudent");

            migrationBuilder.DropTable(
                name: "Komentari");

            migrationBuilder.DropTable(
                name: "Loginovi");

            migrationBuilder.DropTable(
                name: "Oglasi");

            migrationBuilder.DropTable(
                name: "ProfIPredmet");

            migrationBuilder.DropTable(
                name: "StudenICas");

            migrationBuilder.DropTable(
                name: "Casi");

            migrationBuilder.DropTable(
                name: "Clanovi");

            migrationBuilder.DropTable(
                name: "Predmeti");

            migrationBuilder.DropTable(
                name: "Rasporedi");

            migrationBuilder.DropTable(
                name: "Fakulteti");
        }
    }
}
