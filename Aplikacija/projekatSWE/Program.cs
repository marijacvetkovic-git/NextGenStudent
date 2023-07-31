global using projekatSWE.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Microsoft.AspNetCore.Authentication.Cookies;
using projekatSWE.Hubs;
using Microsoft.Extensions.FileProviders;


// var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"))
    .AddConsole()
    .AddDebug();
ConfigurationManager configuration= builder.Configuration;
// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddScoped<IUserService, UserServicess>();
builder.Services.AddHttpContextAccessor();
var connectionString = builder.Configuration.GetConnectionString("nextGenCStud");
builder.Services.AddDbContext<Context>(x => x.UseSqlServer(connectionString));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle


//   "JWT": {
//     "ValidAudience": "http://localhost:4200",
//     "ValidIssuer": "http://localhost:5000",
//     "Secret": "JWTAuthenticationHIGHsecuredPasswordVVVp1OH7Xzyr"

//   }
builder.Services.AddSwaggerGen(options => {
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme (\"bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value))
    };
}).AddCookie();

builder.Services.AddAuthorization();


builder.Services.AddCors(options => options.AddPolicy("CORS", builder =>
    {
        builder.AllowAnyOrigin();
        builder.WithOrigins(new string[]
        {
                        "http://localhost:7048",
                        "https://localhost:7048",
                        "http://127.0.0.1:7048",
                        "https://127.0.0.1:7048",
                        "http://localhost:8000",
                        "https://localhost:8000",
                        "http://127.0.0.1:8000",
                        "https://127.0.0.1:8000",
                        "http://localhost:3000",
                        "https://localhost:3000",
                        "http://127.0.0.1:3000",
                        "https://127.0.0.1:3000",
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
		.WithMethods("GET","PUT","POST","DELETE","PATCH");
    }));
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.UseCors("CORS");
app.UseStaticFiles(new StaticFileOptions{ 
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath,"Images")),
    RequestPath = "/Images" });
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

app.Run();
/* 
Add-Migration V12 -context AuthenticateDbContext
update-database -Context AuthenticateDbContext


*/