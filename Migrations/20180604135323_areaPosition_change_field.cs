using Microsoft.EntityFrameworkCore.Migrations;

namespace streamtools.Migrations
{
    public partial class areaPosition_change_field : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "StartY",
                table: "EnvSettings",
                nullable: true,
                oldClrType: typeof(decimal));

            migrationBuilder.AlterColumn<decimal>(
                name: "StartX",
                table: "EnvSettings",
                nullable: true,
                oldClrType: typeof(decimal));

            migrationBuilder.AlterColumn<decimal>(
                name: "MaxWidth",
                table: "EnvSettings",
                nullable: true,
                oldClrType: typeof(decimal));

            migrationBuilder.AlterColumn<decimal>(
                name: "MaxHeight",
                table: "EnvSettings",
                nullable: true,
                oldClrType: typeof(decimal));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "StartY",
                table: "EnvSettings",
                nullable: false,
                oldClrType: typeof(decimal),
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "StartX",
                table: "EnvSettings",
                nullable: false,
                oldClrType: typeof(decimal),
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "MaxWidth",
                table: "EnvSettings",
                nullable: false,
                oldClrType: typeof(decimal),
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "MaxHeight",
                table: "EnvSettings",
                nullable: false,
                oldClrType: typeof(decimal),
                oldNullable: true);
        }
    }
}
