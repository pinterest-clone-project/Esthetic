using Application.Interfaces;
using Application.Models.SeedDTO;
using AutoMapper;
using Domain.Entities.Category;
using System.Text.Json;

namespace Infrastructure.Data.Seed.Seeders;

public static class CategorySeeder
{
    public static async Task SeedAsync(
        AppDbContext context,
        IMapper mapper,
        IImageService imageService)
    {
        if (context.Categories.Any()) return;

        Console.WriteLine("------------ Start seed categories ----------------------");

        var baseDir = AppContext.BaseDirectory;
        var jsonFile = Path.Combine(baseDir, "Data", "Seed", "JsonSeedData", "Categories.json");
        var seedImagesDir = Path.Combine(baseDir, "Data", "Seed", "SeedImages", "Categories");

        if (!File.Exists(jsonFile))
        {
            Console.WriteLine("Not Found File Categories.json");
            return;
        }

        var jsonData = await File.ReadAllTextAsync(jsonFile);

        List<CategorySeedDTO> categories;
        try
        {
            categories = JsonSerializer.Deserialize<List<CategorySeedDTO>>(jsonData) ?? [];
        }
        catch (JsonException ex)
        {
            Console.WriteLine("Error Json Parse Data: {0}", ex.Message);
            return;
        }

        foreach (var dto in categories)
        {
            var entity = mapper.Map<CategoryEntity>(dto);

            var localPath = Path.Combine(seedImagesDir, dto.LocalImage);
            if (File.Exists(localPath))
            {
                entity.Image = await imageService.SaveImageFromPathAsync(localPath);
            }
            else
            {
                Console.WriteLine("Image not found, skipping: {0}", dto.LocalImage);
                entity.Image = string.Empty;
            }

            await context.Categories.AddAsync(entity);
        }

        await context.SaveChangesAsync();
        Console.WriteLine("------------ Categories seeded successfully ----------------------");
    }
}
