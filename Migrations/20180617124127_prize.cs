using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace streamtools.Migrations
{
    public partial class prize : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PrizeDrawHistory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Uid = table.Column<string>(nullable: true),
                    EventTitle = table.Column<string>(nullable: true),
                    StartTime = table.Column<DateTime>(nullable: false),
                    EndTime = table.Column<DateTime>(nullable: false),
                    Keyword = table.Column<string>(nullable: true),
                    JoinPlayers = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrizeDrawHistory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PrizeDrawDetail",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PrizeDrawHistoryId = table.Column<int>(nullable: false),
                    Winner = table.Column<string>(nullable: true),
                    Prize = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrizeDrawDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrizeDrawDetail_PrizeDrawHistory_PrizeDrawHistoryId",
                        column: x => x.PrizeDrawHistoryId,
                        principalTable: "PrizeDrawHistory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PrizeDrawDetail_PrizeDrawHistoryId",
                table: "PrizeDrawDetail",
                column: "PrizeDrawHistoryId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PrizeDrawDetail");

            migrationBuilder.DropTable(
                name: "PrizeDrawHistory");
        }
    }
}
