import {
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
	boolean,
	integer,
} from "drizzle-orm/pg-core";
import { courses } from "./courses";
import { questionnaires } from "./questionnaire";

export const courseQuestionnaires = pgTable(
	"course_questionnaires",
	{
		id: uuid("id").defaultRandom().primaryKey(),

		courseId: uuid("course_id")
			.references(() => courses.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),

		questionnaireId: uuid("questionnaire_id")
			.references(() => questionnaires.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),

		isActive: boolean("is_active").default(true),
		type: varchar("type", { length: 20 }).notNull().default("quiz"),
		createdAt: timestamp("created_at").defaultNow(),
	}
);
