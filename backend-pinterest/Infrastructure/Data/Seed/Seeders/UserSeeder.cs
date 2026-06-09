using Application.Interfaces;
using Application.Mappers;
using Application.Models.SeedDTO;
using Domain.Constants;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;

namespace Infrastructure.Data.Seed.Seeders;

public static class UserSeeder
{
    public static async Task SeedAsync(
        AppDbContext context,
        SeederMapper mapper,
        IImageService imageService,
        UserManager<UserEntity> userManager,
        RoleManager<RoleEntity> roleManager)
    {
        if (context.Users.Any()) return;

        var baseDir = AppContext.BaseDirectory;
        var jsonFile = Path.Combine(baseDir, "Data", "Seed", "JsonSeedData", "Users.json");
        var seedImagesDir = Path.Combine(baseDir, "Data", "Seed", "SeedImages", "Users");

        if (!File.Exists(jsonFile))
        {
            Console.WriteLine("Not Found File Users.json");
            return;
        }

        var jsonData = await File.ReadAllTextAsync(jsonFile);

        List<UserSeedDTO> users;
        try
        {
            users = JsonSerializer.Deserialize<List<UserSeedDTO>>(jsonData) ?? [];
        }
        catch (JsonException ex)
        {
            Console.WriteLine("Error Json Parse Data: {0}", ex.Message);
            return;
        }

        foreach (var user in users)
        {
            var entity = mapper.ToEntity(user);
            entity.UserName = user.UserName;

            if (!string.IsNullOrEmpty(user.LocalImage))
            {
                var localPath = Path.Combine(seedImagesDir, user.LocalImage);
                entity.Image = File.Exists(localPath)
                    ? await imageService.SaveImageFromPathAsync(localPath)
                    : await imageService.SaveImageFromUrlAsync(user.Image);

                if (!File.Exists(localPath))
                    Console.WriteLine("Local image not found: {0}, falling back to URL", user.LocalImage);
            }
            else
            {
                entity.Image = await imageService.SaveImageFromUrlAsync(user.Image);
            }

            var result = await userManager.CreateAsync(entity, user.Password);
            if (!result.Succeeded)
            {
                Console.WriteLine("Error Create User {0}: {1}",
                    user.Email,
                    string.Join(", ", result.Errors.Select(e => e.Description)));
                continue;
            }

            var roles = user.Roles.Count > 0 ? user.Roles : [Roles.User];

            foreach (var role in roles)
            {
                if (await roleManager.RoleExistsAsync(role))
                    await userManager.AddToRoleAsync(entity, role);
                else
                    Console.WriteLine("Not Found Role: {0}", role);
            }
        }
    }
}