// /easytrade-ui/src/app/lib/definitions.ts
import { z } from 'zod';

// --- Core Entity Type Definitions ---
export type User = {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  verified: boolean;
  createdAt: string;
};

export type Product = {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  sellerUsername?: string;
  createdAt?: string;
  updatedAt?: string;
};

// --- Zod Schemas for Validation ---
export const ListingFormSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required.' }),
  description: z.string().max(500, { message: 'Description cannot exceed 500 characters.'}).optional(),
  price: z.coerce
    .number({ invalid_type_error: 'Please enter a valid price.' })
    .positive({ message: 'Price must be greater than R0.' })
    .multipleOf(0.01, {message: 'Price must be in a valid currency format (e.g., 123.45).'})
    .optional(),
});

export type ClientListingInput = z.input<typeof ListingFormSchema>;
export type ValidatedClientListingData = z.output<typeof ListingFormSchema>;

export type ProductApiPayload = ValidatedClientListingData & {
  sellerUsername: string;
  imageUrl?: string;
};

// --- Form State Types for Server Actions ---
export type FormState = {
  message?: string | null;
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    api?: string[];
    [key: string]: string[] | undefined;
  };
  success?: boolean;
};

export type CreateListingActionState = FormState;
export type UpdateListingActionState = FormState;
export type DeleteListingActionState = FormState;

// REMOVED DashboardStats and ActivityDataPoint as they are not used in the simplified dashboard
