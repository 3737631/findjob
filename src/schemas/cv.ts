import { z } from "zod/v4";

export const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  start_date: z.string(),
  end_date: z.string().optional(),
  description: z.string(),
  highlights: z.array(z.string()),
});

export const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  start_date: z.string(),
  end_date: z.string().optional(),
});

export const parsedCVSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  languages: z.array(z.string()),
  certifications: z.array(z.string()),
});

export const cvUploadSchema = z.object({
  file: z.instanceof(File).refine((f) => f.type === "application/pdf", {
    message: "Solo se aceptan archivos PDF",
  }),
});

export type ParsedCV = z.infer<typeof parsedCVSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
