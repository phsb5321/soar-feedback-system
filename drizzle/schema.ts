import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  audio_url: text('audio_url').notNull(), // URL or path to audio file (if stored)
  transcription: text('transcription').notNull(),
  csat: integer('csat'), // Customer Satisfaction (0-10)
  additional_comment: text('additional_comment'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
