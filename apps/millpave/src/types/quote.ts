import z from 'zod';
import { quoteInputItem, unitEnum } from '../validators/quote';

export type Unit = z.infer<typeof unitEnum>;

export type QuoteInputItem = z.infer<typeof quoteInputItem>;

export type QuoteItemMetadata = unknown;
