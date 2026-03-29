using Application.Interfaces;
using Application.Models.SeedDTO;
using AutoMapper;
using Domain.Entities.Identity;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Infrastructure.Data.Seed.Seeders;

public static class UserSeeder
{
    public static async Task SeedAsync(
        AppDbContext context, 
        IMapper mapper, 
        IImageService imageService, 
        UserManager<UserEntity> userManager, 
        RoleManager<RoleEntity> roleManager)
    {
        if (!context.Users.Any())
        {
            var baseDir = AppContext.BaseDirectory;
            var jsonFile = Path.Combine(baseDir, "Data", "Seed", "JsonSeedData", "Users.json");
            if (File.Exists(jsonFile))
            {
                var jsonData = await File.ReadAllTextAsync(jsonFile);
                try
                {
                    var users = JsonSerializer.Deserialize<List<UserSeedDTO>>(jsonData);
                    foreach (var user in users)
                    {
                        var entity = mapper.Map<UserEntity>(user);
                        entity.UserName = user.UserName;
                        entity.Image = await imageService.SaveImageFromUrlAsync(user.Image);
                        var result = await userManager.CreateAsync(entity, user.Password);
                        if (!result.Succeeded)
                        {
                            Console.WriteLine("Error Create User {0}", user.Email);
                            continue;
                        }
                        foreach (var role in user.Roles)
                        {
                            if (await roleManager.RoleExistsAsync(role))
                            {
                                await userManager.AddToRoleAsync(entity, role);
                            }
                            else
                            {
                                Console.WriteLine("Not Found Role {0}", role);
                            }
                        }
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error Json Parse Data {0}", ex.Message);
                }
            }
            else
            {
                Console.WriteLine("Not Found File Users.json");
            }
        }
    }
}
