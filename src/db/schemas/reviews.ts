import {
    pgTable,
    uuid,
    integer,
    text,
    boolean,
    foreignKey,
    timestamp,
  } from "drizzle-orm/pg-core";
  import { courses } from "./courses"; // Assuming courses table is already defined
  import { user } from "./user"; // Assuming user table is already defined
  
  export const reviews = pgTable(
    "reviews",
    {
      id: uuid("id").defaultRandom().primaryKey().notNull(), // Unique review ID
  
      // Foreign key reference to the courses table
      course_id: uuid("course_id")
        .references(() => courses.id, {
          onDelete: "cascade", // Cascade delete when course is deleted
          onUpdate: "cascade", // Cascade update when course ID is updated
        })
        .notNull(),
  
      // Foreign key reference to the user table
      user_id: uuid("user_id")
        .references(() => user.id, {
          onDelete: "cascade", // Cascade delete when user is deleted
          onUpdate: "cascade", // Cascade update when user ID is updated
        })
        .notNull(),
  
      // Rating (1 to 5) without `check` method, ensure validation in business logic
      rating: integer("rating").notNull(), // Rating between 1 and 5, handled in application logic
  
      // Review comment (nullable)
      comment: text("comment"),
  
      // Avatar URL (nullable)
      avatar_url: text("avatar_url"),
  
      // Timestamps for when the review was created and last updated
      created_at: timestamp("created_at").defaultNow(),
      updated_at: timestamp("updated_at")
        .defaultNow()
        .$onUpdateFn(() => new Date()), // Correct method to update `updated_at` on update
  
      // Whether the review is visible (defaults to true)
      is_visible: boolean("is_visible").default(true).notNull(),
    },
    (table) => {
      return {
        // Foreign key constraints to ensure referential integrity
        reviewCourseFk: foreignKey({
          columns: [table.course_id],
          foreignColumns: [courses.id],
          name: "reviews_course_id_courses_id_fk",
        }),
        reviewUserFk: foreignKey({
          columns: [table.user_id],
          foreignColumns: [user.id],
          name: "reviews_user_id_user_id_fk",
        }),
      };
    }
  );  