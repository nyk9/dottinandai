import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const responses = pgTable("responses", {
	id: serial("id").primaryKey(),
	questionId: varchar("question_id", { length: 255 }).notNull(),
	positionValue: integer("position_value").notNull(),
	sessionId: varchar("session_id", { length: 255 }),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;
