import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const instructorReviews = pgTable("instructor_reviews", {
	id: uuid("id").primaryKey().defaultRandom(),
	courseId: text("course_id").notNull(),
	reviewerName: text("reviewer_name").notNull(),
	rating: integer("rating").notNull(),
	comment: text("comment").notNull(),
	reviewDate: text("review_date"),
	createdAt: timestamp("created_at").defaultNow(),
});
