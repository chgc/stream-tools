using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using stream_tools.Models;

namespace stream_tools
{
  public class Startup
  {
    public IConfiguration Configuration { get; set; }
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {

      // Add framework services.
      services.AddDbContext<StreamDbContext>(options =>
          options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

      services.AddIdentity<ApplicationUser, IdentityRole>()
        .AddEntityFrameworkStores<StreamDbContext>()
        .AddDefaultTokenProviders();


      services.AddAuthentication().AddGoogle(googleOptions =>
      {
        googleOptions.ClientId = Configuration["Authentication:Google:ClientId"];
        googleOptions.ClientSecret = Configuration["Authentication:Google:ClientSecret"];
      });

      // services.AddIdentityServer()
      //            .AddDeveloperSigningCredential();

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
      // app.UseIdentityServer();

      app.UseCors("CorsPolicy");
      app.UseSignalR(routes =>
                 {
                   routes.MapHub<ActionHub>("/actionHub");
                   routes.MapHub<SimpleHub>("/simpleHub");
                 });

      //app.Use(async (context, next) =>
      //{
      //  await next();
      //  if (context.Response.StatusCode == 404 &&
      //      !Path.HasExtension(context.Request.Path.Value) &&
      //      !context.Request.Path.Value.StartsWith("/api/"))
      //  {
      //    context.Request.Path = "/index.html";
      //    await next();
      //  }
      //});
      app.UseAuthentication();

      app.UseMvc();
      app.UseStaticFiles();
    }
  }
}
