using Application.Interfaces;
using Domain.Entities.PinTag;
using Domain.Entities.Pin;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Application.Models.SeedDTO;

namespace Infrastructure.Data.Seed.Seeders;
public class PinSeeder
{
    public static async Task SeedAsync(AppDbContext context, IImageService imageService)
    {
        if (!context.Pins.Any())
        {
            Console.WriteLine("------------Start seed pins----------------------");
            var baseDir = AppContext.BaseDirectory;
            var jsonFile = Path.Combine(baseDir, "Data", "Seed", "JsonSeedData", "Pins.json");

            if (File.Exists(jsonFile))
            {
                var jsonData = await File.ReadAllTextAsync(jsonFile);
                try
                {
                    var pins = JsonSerializer.Deserialize<List<PinSeedDTO>>(jsonData);
                    if (pins != null)
                    {
                        var defaultCreator = await context.Users.FirstOrDefaultAsync();
                        var allTags = await context.Tags.ToListAsync();
                        var allCategories = await context.Categories.ToListAsync();

                        if (defaultCreator == null)
                        {
                            Console.WriteLine("No users found, skipping pin seed.");
                            return;
                        }

                        foreach (var pin in pins)
                        {
                            var entity = new PinEntity
                            {
                                CreatorId = defaultCreator.Id,
                                Title = pin.Title,
                                Description = pin.Description,
                                SourceUrl = pin.SourceUrl,
                                CategoryId = pin.CategoryName != null
                                    ? allCategories.FirstOrDefault(c => c.Name == pin.CategoryName)?.Id
                                    : null,
                                PinTags = pin.Tags != null
                                    ? allTags
                                        .Where(t => pin.Tags.Contains(t.Name))
                                        .Select(t => new PinTagEntity { TagId = t.Id })
                                        .ToList()
                                    : null
                            };

                            if (!string.IsNullOrWhiteSpace(pin.MediaUrl))
                            {
                                try
                                {
                                    entity.Image = await imageService.SaveImageFromUrlAsync(pin.MediaUrl);
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine("Failed to download pin image: {0}", ex.Message);
                                    entity.Image = string.Empty;
                                }
                            }

                            await context.Pins.AddAsync(entity);
                        }
                        await context.SaveChangesAsync();
                    }
                }
                catch (JsonException ex)
                {
                    Console.WriteLine("Error Json Parse Data {0}", ex.Message);
                }
                catch (NotSupportedException ex)
                {
                    Console.WriteLine("Error Json Parse Data {0}", ex.Message);
                }
            }
            else
            {
                Console.WriteLine("Not Found File Pins.json");
            }
        }
    }
}
