import { relations } from "drizzle-orm/relations";
import { user, orders, userCategories, categories, userDetails, userSocials, certification, certificateIssuance, courses, cart, certificateWithPlaceholders, chapters, lectures, files, questionnaires, questions, courseQuestionnaires, certificateTracking } from "./schema";

export const ordersRelations = relations(orders, ({one}) => ({
	user: one(user, {
		fields: [orders.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	orders: many(orders),
	userCategories: many(userCategories),
	userDetails: many(userDetails),
	userSocials: many(userSocials),
	certificateIssuances_issuedBy: many(certificateIssuance, {
		relationName: "certificateIssuance_issuedBy_user_id"
	}),
	certificateIssuances_issuedTo: many(certificateIssuance, {
		relationName: "certificateIssuance_issuedTo_user_id"
	}),
	courses: many(courses),
	carts: many(cart),
	certifications: many(certification),
	certificateWithPlaceholders: many(certificateWithPlaceholders),
}));

export const userCategoriesRelations = relations(userCategories, ({one}) => ({
	user: one(user, {
		fields: [userCategories.userId],
		references: [user.id]
	}),
	category: one(categories, {
		fields: [userCategories.categoryId],
		references: [categories.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	userCategories: many(userCategories),
}));

export const userDetailsRelations = relations(userDetails, ({one}) => ({
	user: one(user, {
		fields: [userDetails.userId],
		references: [user.id]
	}),
}));

export const userSocialsRelations = relations(userSocials, ({one}) => ({
	user: one(user, {
		fields: [userSocials.userId],
		references: [user.id]
	}),
}));

export const certificateIssuanceRelations = relations(certificateIssuance, ({one}) => ({
	certification: one(certification, {
		fields: [certificateIssuance.certificateId],
		references: [certification.id]
	}),
	user_issuedBy: one(user, {
		fields: [certificateIssuance.issuedBy],
		references: [user.id],
		relationName: "certificateIssuance_issuedBy_user_id"
	}),
	user_issuedTo: one(user, {
		fields: [certificateIssuance.issuedTo],
		references: [user.id],
		relationName: "certificateIssuance_issuedTo_user_id"
	}),
}));

export const certificationRelations = relations(certification, ({one, many}) => ({
	certificateIssuances: many(certificateIssuance),
	courses: many(courses),
	user: one(user, {
		fields: [certification.ownerId],
		references: [user.id]
	}),
	certificateWithPlaceholder: one(certificateWithPlaceholders, {
		fields: [certification.certificateId],
		references: [certificateWithPlaceholders.id]
	}),
	certificateTrackings: many(certificateTracking),
}));

export const coursesRelations = relations(courses, ({one, many}) => ({
	user: one(user, {
		fields: [courses.userId],
		references: [user.id]
	}),
	certification: one(certification, {
		fields: [courses.certificateId],
		references: [certification.id]
	}),
	carts: many(cart),
	files: many(files),
	chapters: many(chapters),
	courseQuestionnaires: many(courseQuestionnaires),
}));

export const cartRelations = relations(cart, ({one}) => ({
	user: one(user, {
		fields: [cart.userId],
		references: [user.id]
	}),
	course: one(courses, {
		fields: [cart.courseId],
		references: [courses.id]
	}),
}));

export const certificateWithPlaceholdersRelations = relations(certificateWithPlaceholders, ({one, many}) => ({
	certifications: many(certification),
	user: one(user, {
		fields: [certificateWithPlaceholders.ownerId],
		references: [user.id]
	}),
}));

export const lecturesRelations = relations(lectures, ({one}) => ({
	chapter: one(chapters, {
		fields: [lectures.chapterId],
		references: [chapters.id]
	}),
}));

export const chaptersRelations = relations(chapters, ({one, many}) => ({
	lectures: many(lectures),
	course: one(courses, {
		fields: [chapters.courseId],
		references: [courses.id]
	}),
}));

export const filesRelations = relations(files, ({one}) => ({
	course: one(courses, {
		fields: [files.courseId],
		references: [courses.id]
	}),
}));

export const questionsRelations = relations(questions, ({one}) => ({
	questionnaire: one(questionnaires, {
		fields: [questions.questionnaireId],
		references: [questionnaires.id]
	}),
}));

export const questionnairesRelations = relations(questionnaires, ({many}) => ({
	questions: many(questions),
	courseQuestionnaires: many(courseQuestionnaires),
}));

export const courseQuestionnairesRelations = relations(courseQuestionnaires, ({one}) => ({
	course: one(courses, {
		fields: [courseQuestionnaires.courseId],
		references: [courses.id]
	}),
	questionnaire: one(questionnaires, {
		fields: [courseQuestionnaires.questionnaireId],
		references: [questionnaires.id]
	}),
}));

export const certificateTrackingRelations = relations(certificateTracking, ({one}) => ({
	certification: one(certification, {
		fields: [certificateTracking.certificateId],
		references: [certification.id]
	}),
}));