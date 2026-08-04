import { create } from "zustand";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface FormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    birthDate: string;
    bio: string;
    phoneNumber: string;
    gender: "Male" | "Female" | "Other" | null;
    country: string;
    language: string;
    categoryIds: string[];
    imageFile: File | null;
    isPrivate: boolean;
}

const initialFormData: FormData = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    birthDate: "",
    bio: "",
    phoneNumber: "",
    gender: null,
    country: "",
    language: "",
    categoryIds: [],
    imageFile: null,
    isPrivate: false,
};

interface RegisterFormState {
    step: Step;
    formData: FormData;
    imagePreview: string | null;
    setStep: (step: Step) => void;
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
    setImagePreview: (url: string | null) => void;
    reset: () => void;
}

export const useRegisterFormStore = create<RegisterFormState>((set) => ({
    step: 1,
    formData: initialFormData,
    imagePreview: null,
    setStep: (step) => set({ step }),
    updateField: (field, value) =>
        set((state) => ({ formData: { ...state.formData, [field]: value } })),
    setImagePreview: (url) => set({ imagePreview: url }),
    reset: () => set({ step: 1, formData: initialFormData, imagePreview: null }),
}));
