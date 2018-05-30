using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace stream_tools
{
  public class Startup
  {
    public IConfigurationRoot Configuration { get; set; }
    public Startup(IHostingEnvironment env)
    {
      var builder = new ConfigurationBuilder()
        .SetBasePath(env.ContentRootPath)
        .AddJsonFile("appsettings.json", optional: true);

      Configuration = builder.Build();
    }
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {

      // Add framework services.
      services.AddDbContext<StreamContext>(options =>
          options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

      services.AddCors(options => options.AddPolicy("CorsPolicy",
       builder =>
       {
         builder.WithOrigins(new string[] { "http://localhost:4200", "https://amos-streaming.azurewebsites.net/" })
                      .AllowCredentials()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
       }));

      services.AddSignalR();
      services.AddMvc();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      app.UseCors("CorsPolicy");
      app.UseSignalR(routes =>
                 {
                   routes.MapHub<ActionHub>("/actionHub");
                   routes.MapHub<SimpleHub>("/simpleHub");
                 });

      app.Use(async (context, next) =>
      {
        await next();
        if (context.Response.StatusCode == 404 &&
            !Path.HasExtension(context.Request.Path.Value) &&
            !context.Request.Path.Value.StartsWith("/api/"))
        {
          context.Request.Path = "/index.html";
          await next();
        }
      });
      app.UseStaticFiles();
    }
  }
}
