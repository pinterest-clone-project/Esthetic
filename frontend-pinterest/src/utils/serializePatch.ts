export const serializePatch = <T extends object>(data: T): FormData => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
        if (value === undefined) continue;

        if (value instanceof File) {
            formData.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, String(item)));
        } else if (typeof value === "boolean") {
            formData.append(key, String(value));
        } else if (value === null) {
            formData.append(key, "");
        } else {
            formData.append(key, String(value));
        }
    }

    return formData;
};