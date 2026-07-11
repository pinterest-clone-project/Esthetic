using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Infrastructure.Services;

public class ImageService(IConfiguration configuration) : IImageService
{
    public async Task DeleteImageAsync(string name)
    {
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();
        var dir = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!);

        Task[] tasks = sizes
            .AsParallel()
            .Select(size =>
            {
                return Task.Run(() =>
                {
                    var path = Path.Combine(dir, $"{size}_{name}");
                    if (File.Exists(path))
                    {
                        File.Delete(path);
                    }
                });
            })
            .ToArray();

        await Task.WhenAll(tasks);
    }

    public async Task<string> SaveImageAsync(IFormFile file)
    {
        using MemoryStream ms = new();
        await file.CopyToAsync(ms);
        var bytes = ms.ToArray();

        var imageName = await SaveImageAsync(bytes);
        return imageName;
    }

    public async Task<string> SaveImageFromBase64Async(string input)
    {
        var base64Data = input.Contains(",")
           ? input.Substring(input.IndexOf(",") + 1)
           : input;

        byte[] imageBytes = Convert.FromBase64String(base64Data);

        return await SaveImageAsync(imageBytes);
    }

    public async Task<string> SaveImageFromPathAsync(string filePath)
    {
        var bytes = await File.ReadAllBytesAsync(filePath);
        return await SaveImageAsync(bytes);
    }

    public async Task<string> SaveImageFromUrlAsync(string imageUrl)
    {
        using var httpClient = new HttpClient();


        httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        httpClient.DefaultRequestHeaders.Add("Accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8");

        try
        {
            var response = await httpClient.GetAsync(imageUrl);

            response.EnsureSuccessStatusCode();

            var contentType = response.Content.Headers.ContentType?.MediaType;
            if (contentType != null && !contentType.StartsWith("image/"))
            {
                throw new InvalidDataException($"URL повернув тип '{contentType}' замість зображення.");
            }

            var imageBytes = await response.Content.ReadAsByteArrayAsync();
            return await SaveImageAsync(imageBytes);
        }
        catch (Exception ex)
        {
            throw new Exception($"Не вдалося завантажити або обробити зображення з URL: {imageUrl}. Причина: {ex.Message}", ex);
        }
    }

    private async Task<string> SaveImageAsync(byte[] bytes)
    {
        string imageName = $"{Path.GetRandomFileName()}.webp";
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();

        Task[] tasks = sizes
            .AsParallel()
            .Select(s => SaveImageAsync(bytes, imageName, s))
            .ToArray();

        await Task.WhenAll(tasks);

        return imageName;
    }

    private async Task SaveImageAsync(byte[] bytes, string name, int size)
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!,
            $"{size}_{name}");

        using var image = Image.Load(bytes);
        image.Mutate(imgContext =>
        {
            imgContext.Resize(new ResizeOptions
            {
                Size = new Size(size, size),
                Mode = ResizeMode.Max
            });
        });

        await image.SaveAsync(path, new WebpEncoder());
    }


    public async Task<string> CreateCollageAsync(List<string> imageNames)
    {
        if (imageNames.Count == 0)
            throw new ArgumentException("At least one image is required for a collage.");

        const int tileSourceSize = 400;
        const int canvasSize = 800;
        var dir = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!);

        var tiles = imageNames
            .Take(4)
            .Select(name => Path.Combine(dir, $"{tileSourceSize}_{name}"))
            .Where(File.Exists)
            .Select(Image.Load)
            .ToList();

        if (tiles.Count == 0)
            throw new ArgumentException("None of the provided images exist on disk.");

        using var canvas = new Image<Rgba32>(canvasSize, canvasSize);

        canvas.Mutate(ctx =>
        {
            switch (tiles.Count)
            {
                case 1:
                    DrawTile(ctx, tiles[0], 0, 0, canvasSize, canvasSize);
                    break;
                case 2:
                    DrawTile(ctx, tiles[0], 0, 0, canvasSize / 2, canvasSize);
                    DrawTile(ctx, tiles[1], canvasSize / 2, 0, canvasSize / 2, canvasSize);
                    break;
                case 3:
                    DrawTile(ctx, tiles[0], 0, 0, canvasSize / 2, canvasSize);
                    DrawTile(ctx, tiles[1], canvasSize / 2, 0, canvasSize / 2, canvasSize / 2);
                    DrawTile(ctx, tiles[2], canvasSize / 2, canvasSize / 2, canvasSize / 2, canvasSize / 2);
                    break;
                default:
                    DrawTile(ctx, tiles[0], 0, 0, canvasSize / 2, canvasSize / 2);
                    DrawTile(ctx, tiles[1], canvasSize / 2, 0, canvasSize / 2, canvasSize / 2);
                    DrawTile(ctx, tiles[2], 0, canvasSize / 2, canvasSize / 2, canvasSize / 2);
                    DrawTile(ctx, tiles[3], canvasSize / 2, canvasSize / 2, canvasSize / 2, canvasSize / 2);
                    break;
            }
        });

        foreach (var tile in tiles) tile.Dispose();

        using var ms = new MemoryStream();
        await canvas.SaveAsync(ms, new WebpEncoder());

        return await SaveImageAsync(ms.ToArray());
    }

    private static void DrawTile(IImageProcessingContext ctx, Image tile, int x, int y, int w, int h)
    {
        tile.Mutate(t => t.Resize(new ResizeOptions
        {
            Size = new Size(w, h),
            Mode = ResizeMode.Crop
        }));
        ctx.DrawImage(tile, new Point(x, y), 1f);
    }

}