using Application.Interfaces;
using Application.Mappers;
using Domain.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Data.Seed.Seeders;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Services;

public class DbSeederService(IServiceProvider serviceProvider) : IDbSeederService
{
    public async Task SeedData()
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();
        var mapper = scope.ServiceProvider.GetRequiredService<SeederMapper>();
        var imageService = scope.ServiceProvider.GetRequiredService<IImageService>();

        await RoleSeeder.SeedAsync(context, roleManager);
        await UserSeeder.SeedAsync(context, mapper, imageService, userManager, roleManager);
        await TagSeeder.SeedAsync(context, mapper);
        await PinSeeder.SeedAsync(context, imageService);
        await CategorySeeder.SeedAsync(context, mapper, imageService);
    }
}