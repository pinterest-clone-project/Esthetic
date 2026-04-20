

using Application.Interfaces;
using Application.Models.SeedDTO;
using AutoMapper;
using Domain.Entities.Identity;
using Domain.Entities.Tag;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;

namespace Infrastructure.Data.Seed.Seeders;

public class TagSeeder
{

    public static async Task SeedAsync(
            AppDbContext context,
            IMapper mapper)
    {
        if (!context.Tags.Any())
        {
            Console.WriteLine("------------Start seed tags----------------------");
            var baseDir = AppContext.BaseDirectory;
            var jsonFile = Path.Combine(baseDir, "Data", "Seed", "JsonSeedData", "Tags.json");
            if (File.Exists(jsonFile))
            {
                var jsonData = await File.ReadAllTextAsync(jsonFile);
                try
                {
                    var tags = JsonSerializer.Deserialize<List<TagSeedDTO>>(jsonData);
                    if (tags != null)
                    {

                        foreach (var tag in tags)
                        {
                            var entity = mapper.Map<TagEntity>(tag);
                            await context.Tags.AddAsync(entity);
                        }
                        await context.SaveChangesAsync();
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error Json Parse Data {0}", ex.Message);
                }
            }
            else
            {
                Console.WriteLine("Not Found File Tags.json");
            }
        }
    }
}
