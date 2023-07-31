using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projekatSWE.Migrations
{
    public partial class v3333 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Casi_Clanovi_CasStudentCID",
                table: "Casi");

            migrationBuilder.AlterColumn<string>(
                name: "Opis",
                table: "Oglasi",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "CasStudentCID",
                table: "Casi",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Casi_Clanovi_CasStudentCID",
                table: "Casi",
                column: "CasStudentCID",
                principalTable: "Clanovi",
                principalColumn: "CID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Casi_Clanovi_CasStudentCID",
                table: "Casi");

            migrationBuilder.AlterColumn<string>(
                name: "Opis",
                table: "Oglasi",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CasStudentCID",
                table: "Casi",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Casi_Clanovi_CasStudentCID",
                table: "Casi",
                column: "CasStudentCID",
                principalTable: "Clanovi",
                principalColumn: "CID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
