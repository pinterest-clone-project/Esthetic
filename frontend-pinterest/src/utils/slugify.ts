import slugify from "slugify";

export const toSlug = (input: string): string =>
    slugify(input, {
        lower: true,
        strict: true,
        trim: true,
    });