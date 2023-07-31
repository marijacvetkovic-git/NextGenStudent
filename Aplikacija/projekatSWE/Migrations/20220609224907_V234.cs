using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projekatSWE.Migrations
{
    public partial class V234 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Casi_Predmeti_CasPredmetID",
                table: "Casi");

            migrationBuilder.DropTable(
                name: "StudenICas");

            migrationBuilder.AlterColumn<int>(
                name: "CasPredmetID",
                table: "Casi",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CasStudentCID",
                table: "Casi",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "Zakazan",
                table: "Casi",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Casi_CasStudentCID",
                table: "Casi",
                column: "CasStudentCID");

            migrationBuilder.AddForeignKey(
                name: "FK_Casi_Clanovi_CasStudentCID",
                table: "Casi",
                column: "CasStudentCID",
                principalTable: "Clanovi",
                principalColumn: "CID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Casi_Predmeti_CasPredmetID",
                table: "Casi",
                column: "CasPredmetID",
                principalTable: "Predmeti",
                principalColumn: "ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Casi_Clanovi_CasStudentCID",
                table: "Casi");

            migrationBuilder.DropForeignKey(
                name: "FK_Casi_Predmeti_CasPredmetID",
                table: "Casi");

            migrationBuilder.DropIndex(
                name: "IX_Casi_CasStudentCID",
                table: "Casi");

            migrationBuilder.DropColumn(
                name: "CasStudentCID",
                table: "Casi");

            migrationBuilder.DropColumn(
                name: "Zakazan",
                table: "Casi");

            migrationBuilder.AlterColumn<int>(
                name: "CasPredmetID",
                table: "Casi",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

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
                name: "IX_StudenICas_StudentCasCASID",
                table: "StudenICas",
                column: "StudentCasCASID");

            migrationBuilder.AddForeignKey(
                name: "FK_Casi_Predmeti_CasPredmetID",
                table: "Casi",
                column: "CasPredmetID",
                principalTable: "Predmeti",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
