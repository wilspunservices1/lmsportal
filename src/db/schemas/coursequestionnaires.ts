import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
  integer
} from 'drizzle-orm/pg-core';
import { courses } from './courses';
import { questionnaires } from './questionnaire';
import { uniqueIndex } from 'drizzle-orm/pg-core';

export const courseQuestionnaires = pgTable('course_questionnaires', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').references(() => courses.id).notNull(),
  questionnaireId: uuid('questionnaire_id').references(() => questionnaires.id).notNull(),
  isActive: boolean('is_active').default(true),
  type: varchar('type', { length: 20 }).notNull().default('quiz'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  questionnaireIdIdx: uniqueIndex('questionnaire_id_idx').on(table.questionnaireId),
}));