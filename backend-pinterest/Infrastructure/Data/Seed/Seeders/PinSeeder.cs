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
        var existingTitles = context.Pins
            .Select(p => new { p.Title, p.Image })
            .ToList();

        var brokenTitles = existingTitles
            .Where(p => string.IsNullOrEmpty(p.Image))
            .Select(p => p.Title)
            .ToHashSet();

        bool hasAnyPins = existingTitles.Count > 0;

        if (hasAnyPins && brokenTitles.Count == 0)
            return;

        Console.WriteLine("------------Start seed pins----------------------");
        var baseDir = AppContext.BaseDirectory;
        var jsonFile = Path.Combine(baseDir, "Data", "Seed", "JsonSeedData", "Pins.json");

        if (!File.Exists(jsonFile))
        {
            Console.WriteLine("Not Found File Pins.json");
            return;
        }

        var jsonData = await File.ReadAllTextAsync(jsonFile);
        try
        {
            var pins = JsonSerializer.Deserialize<List<PinSeedDTO>>(jsonData);
            if (pins == null) return;

            var defaultCreator = await context.Users.FirstOrDefaultAsync();
            var allTags = await context.Tags.ToListAsync();
            var allCategories = await context.Categories.ToListAsync();

            if (defaultCreator == null)
            {
                Console.WriteLine("No users found, skipping pin seed.");
                return;
            }

            var allExistingTitles = existingTitles.Select(p => p.Title).ToHashSet();

            foreach (var pin in pins)
            {
                // якщо пін вже існує і має зображення — пропускаємо
                if (allExistingTitles.Contains(pin.Title) && !brokenTitles.Contains(pin.Title))
                    continue;

                string? downloadedImage = null;
                if (!string.IsNullOrWhiteSpace(pin.MediaUrl))
                {
                    try
                    {
                        downloadedImage = await imageService.SaveImageFromUrlAsync(pin.MediaUrl);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Failed to download pin image: {0}", ex.Message);
                    }
                }

                if (string.IsNullOrEmpty(downloadedImage))
                {
                    Console.WriteLine("Skipping pin '{0}' — image could not be downloaded.", pin.Title);
                    continue;
                }

                // якщо пін існує але має порожнє зображення — оновлюємо
                if (brokenTitles.Contains(pin.Title))
                {
                    var existing = await context.Pins.FirstOrDefaultAsync(p => p.Title == pin.Title);
                    if (existing != null)
                    {
                        existing.Image = downloadedImage;
                        Console.WriteLine("Fixed image for pin '{0}'", pin.Title);
                    }
                    continue;
                }

                // новий пін
                var entity = new PinEntity
                {
                    CreatorId = defaultCreator.Id,
                    Title = pin.Title,
                    Description = pin.Description,
                    SourceUrl = pin.SourceUrl,
                    Image = downloadedImage,
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

                await context.Pins.AddAsync(entity);
            }

            await context.SaveChangesAsync();
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
}
