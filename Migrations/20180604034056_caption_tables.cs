using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace streamtools.Migrations
{
    public partial class caption_tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Captions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Uid = table.Column<string>(maxLength: 100, nullable: true),
                    ColorClass = table.Column<string>(maxLength: 100, nullable: true),
                    DisplayClass = table.Column<string>(maxLength: 100, nullable: true),
                    Label = table.Column<string>(maxLength: 100, nullable: true),
                    Style = table.Column<string>(maxLength: 1000, nullable: true),
                    Value = table.Column<string>(maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Captions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ConnectionInfos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Uid = table.Column<string>(maxLength: 100, nullable: true),
                    Host = table.Column<string>(maxLength: 100, nullable: true),
                    Port = table.Column<string>(maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConnectionInfos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EnvSettings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Uid = table.Column<string>(maxLength: 100, nullable: true),
                    MaxHeight = table.Column<decimal>(nullable: false),
                    MaxWidth = table.Column<decimal>(nullable: false),
                    StartX = table.Column<decimal>(nullable: false),
                    StartY = table.Column<decimal>(nullable: false),
                    CssStyle = table.Column<string>(maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnvSettings", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Captions");

            migrationBuilder.DropTable(
                name: "ConnectionInfos");

            migrationBuilder.DropTable(
                name: "EnvSettings");
        }
    }
}
