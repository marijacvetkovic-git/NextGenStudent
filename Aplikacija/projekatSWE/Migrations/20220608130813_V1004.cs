using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projekatSWE.Migrations
{
    public partial class V1004 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Oglasi_Clanovi_StudentOglasCID",
                table: "Oglasi");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Loginovi",
                table: "Loginovi");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Loginovi");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Loginovi");

            migrationBuilder.DropColumn(
                name: "PasswordSalt",
                table: "Loginovi");

            migrationBuilder.DropColumn(
                name: "TokenCreated",
                table: "Loginovi");

            migrationBuilder.DropColumn(
                name: "TokenExpires",
                table: "Loginovi");

            migrationBuilder.DropColumn(
                name: "Uloga",
                table: "Loginovi");

            migrationBuilder.RenameColumn(
                name: "RefreshToken",
                table: "Loginovi",
                newName: "Password");

            migrationBuilder.AlterColumn<int>(
                name: "StudentOglasCID",
                table: "Oglasi",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Loginovi",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Opis",
                table: "Clanovi",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Clanovi",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "BrLicneKarte",
                table: "Clanovi",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Loginovi",
                table: "Loginovi",
                column: "Username");

            migrationBuilder.AddForeignKey(
                name: "FK_Oglasi_Clanovi_StudentOglasCID",
                table: "Oglasi",
                column: "StudentOglasCID",
                principalTable: "Clanovi",
                principalColumn: "CID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Oglasi_Clanovi_StudentOglasCID",
                table: "Oglasi");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Loginovi",
                table: "Loginovi");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Loginovi",
                newName: "RefreshToken");

            migrationBuilder.AlterColumn<int>(
                name: "StudentOglasCID",
                table: "Oglasi",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Loginovi",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Loginovi",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<byte[]>(
                name: "PasswordHash",
                table: "Loginovi",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "PasswordSalt",
                table: "Loginovi",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TokenCreated",
                table: "Loginovi",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "TokenExpires",
                table: "Loginovi",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Uloga",
                table: "Loginovi",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Opis",
                table: "Clanovi",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Clanovi",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BrLicneKarte",
                table: "Clanovi",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Loginovi",
                table: "Loginovi",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Oglasi_Clanovi_StudentOglasCID",
                table: "Oglasi",
                column: "StudentOglasCID",
                principalTable: "Clanovi",
                principalColumn: "CID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
