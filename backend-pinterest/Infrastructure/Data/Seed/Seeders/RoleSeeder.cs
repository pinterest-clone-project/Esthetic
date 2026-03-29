using Domain.Constants;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data.Seed.Seeders;

public static class RoleSeeder
{
    public static async Task SeedAsync(AppDbContext context, RoleManager<RoleEntity> roleManager)
    {
        if (!context.Roles.Any())
        {
            foreach (var roleName in Roles.AllRoles)
            {
                var result = await roleManager.CreateAsync(new(roleName));
                if (!result.Succeeded)
                {
                    Console.WriteLine("Error Create Role {0}", roleName);
                }
            }
        }
    }
}
