import { pgTable, integer, text, uuid, json, timestamp, bigint, uniqueIndex, unique, boolean, foreignKey, numeric, varchar, serial, jsonb } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const blog = pgTable("Blog", {
	id: integer("id").primaryKey().notNull(),
	title: text("title").notNull(),
	desc: text("desc").notNull(),
	date: text("date").notNull(),
	publishDate: text("publishDate").notNull(),
	month: text("month").notNull(),
	authorName: text("authorName").notNull(),
});

export const event = pgTable("Event", {
	id: integer("id").primaryKey().notNull(),
	title: text("title").notNull(),
	duration: text("duration").notNull(),
	speaker: text("speaker").notNull(),
});

export const instructorApplications = pgTable("InstructorApplications", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("userId").notNull(),
	instructorBio: text("instructorBio").default(''),
	qualifications: json("qualifications").default([]).notNull(),
	status: text("status").default('pending').notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
});

export const meeting = pgTable("Meeting", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	title: text("title").notNull(),
	date: text("date").notNull(),
	duration: text("duration").notNull(),
	startingTime: text("startingTime").notNull(),
	speakerName: text("speakerName").notNull(),
	department: text("department").notNull(),
});

export const verificationToken = pgTable("VerificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		verificationTokenUnique: uniqueIndex("verificationTokenUnique").using("btree", table.identifier.asc().nullsLast(), table.token.asc().nullsLast()),
		verificationTokenTokenUnique: unique("VerificationToken_token_unique").on(table.token),
	}
});

export const user = pgTable("User", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	uniqueIdentifier: text("uniqueIdentifier").notNull(),
	name: text("name").notNull(),
	username: text("username"),
	phone: text("phone"),
	email: text("email").notNull(),
	password: text("password").notNull(),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
	roles: json("roles").default(["user"]).notNull(),
	enrolledCourses: json("enrolledCourses").default([]).notNull(),
	wishlist: json("wishlist").default([]).notNull(),
	isVerified: boolean("isVerified").default(false).notNull(),
	activationToken: text("activationToken"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
	instructorBio: text("instructorBio").default(''),
	qualifications: json("qualifications").default([]).notNull(),
},
(table) => {
	return {
		userUniqueIdentifierUnique: unique("User_uniqueIdentifier_unique").on(table.uniqueIdentifier),
		userUsernameUnique: unique("User_username_unique").on(table.username),
		userPhoneUnique: unique("User_phone_unique").on(table.phone),
		userEmailUnique: unique("User_email_unique").on(table.email),
	}
});

export const orders = pgTable("Orders", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("userId").notNull(),
	status: text("status").notNull(),
	totalAmount: numeric("totalAmount", { precision: 10, scale:  2 }).notNull(),
	paymentMethod: text("paymentMethod").notNull(),
	items: json("items").notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		ordersUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Orders_userId_User_id_fk"
		}).onDelete("cascade"),
	}
});

export const userCategories = pgTable("UserCategories", {
	userId: uuid("userId").notNull(),
	categoryId: uuid("categoryId").notNull(),
},
(table) => {
	return {
		userCategoriesUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UserCategories_userId_User_id_fk"
		}),
		userCategoriesCategoryIdCategoriesIdFk: foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "UserCategories_categoryId_Categories_id_fk"
		}),
	}
});

export const categories = pgTable("Categories", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	title: text("title").notNull(),
	description: text("description"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
});

export const userDetails = pgTable("userDetails", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("userId").notNull(),
	biography: text("biography"),
	expertise: text("expertise").array().default([""]).notNull(),
	registrationDate: timestamp("registrationDate", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		userDetailsUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "userDetails_userId_User_id_fk"
		}),
	}
});

export const userSocials = pgTable("UserSocials", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("userId").notNull(),
	facebook: text("facebook").default('').notNull(),
	twitter: text("twitter").default('').notNull(),
	linkedin: text("linkedin").default('').notNull(),
	website: text("website").default('').notNull(),
	github: text("github").default('').notNull(),
},
(table) => {
	return {
		userSocialsUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UserSocials_userId_User_id_fk"
		}),
	}
});

export const certificateIssuance = pgTable("CertificateIssuance", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	certificateId: uuid("certificateId").notNull(),
	issuedBy: uuid("issuedBy").notNull(),
	issuedTo: uuid("issuedTo").notNull(),
	signature: text("signature"),
	description: text("description"),
	issuanceUniqueIdentifier: text("issuanceUniqueIdentifier").notNull(),
	isRevoked: boolean("isRevoked").default(false).notNull(),
	revocationReason: text("revocationReason"),
	isExpired: boolean("isExpired").default(false).notNull(),
	expirationDate: timestamp("expirationDate", { mode: 'string' }),
	issuedAt: timestamp("issuedAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		certificateIssuanceCertificateIdCertificationIdFk: foreignKey({
			columns: [table.certificateId],
			foreignColumns: [certification.id],
			name: "CertificateIssuance_certificateId_Certification_id_fk"
		}),
		certificateIssuanceIssuedByUserIdFk: foreignKey({
			columns: [table.issuedBy],
			foreignColumns: [user.id],
			name: "CertificateIssuance_issuedBy_User_id_fk"
		}),
		certificateIssuanceIssuedToUserIdFk: foreignKey({
			columns: [table.issuedTo],
			foreignColumns: [user.id],
			name: "CertificateIssuance_issuedTo_User_id_fk"
		}),
		certificateIssuanceIssuanceUniqueIdentifierUnique: unique("CertificateIssuance_issuanceUniqueIdentifier_unique").on(table.issuanceUniqueIdentifier),
	}
});

export const courses = pgTable("courses", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	price: numeric("price", { precision: 10, scale:  2 }).notNull(),
	slug: varchar("slug", { length: 255 }).notNull(),
	lesson: varchar("lesson", { length: 100 }).notNull(),
	duration: varchar("duration", { length: 100 }).notNull(),
	featured: boolean("featured").default(false),
	estimatedPrice: numeric("estimatedPrice", { precision: 10, scale:  2 }),
	isFree: boolean("isFree").default(false),
	tag: varchar("tag", { length: 100 }).notNull(),
	skillLevel: varchar("skillLevel", { length: 100 }).notNull(),
	categories: json("categories").default([]).notNull(),
	insName: varchar("insName", { length: 255 }).notNull(),
	thumbnail: text("thumbnail"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
	userId: uuid("userId").notNull(),
	demoVideoUrl: varchar("demoVideoUrl", { length: 500 }),
	isPublished: boolean("isPublished").default(false),
	enrolledCount: numeric("enrolledCount", { precision: 10, scale:  0 }).default('0').notNull(),
	discount: numeric("discount", { precision: 10, scale:  2 }).default('0').notNull(),
	extras: json("extras").default({}).notNull(),
	reviews: json("reviews").default([]).notNull(),
	comments: json("comments").default([]).notNull(),
	certificateId: uuid("certificateId"),
},
(table) => {
	return {
		coursesUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "courses_userId_User_id_fk"
		}),
		coursesCertificateIdCertificationIdFk: foreignKey({
			columns: [table.certificateId],
			foreignColumns: [certification.id],
			name: "courses_certificateId_Certification_id_fk"
		}),
		coursesSlugUnique: unique("courses_slug_unique").on(table.slug),
	}
});

export const placeholders = pgTable("Placeholders", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	certificationId: uuid("certificationId").notNull(),
	key: text("key").notNull(),
	discount: numeric("discount", { precision: 10, scale:  2 }).default('0').notNull(),
	x: numeric("x", { precision: 10, scale:  2 }).default('0').notNull(),
	y: numeric("y", { precision: 10, scale:  2 }).default('0').notNull(),
	fontSize: numeric("fontSize", { precision: 10, scale:  2 }).default('12').notNull(),
	isVisible: boolean("isVisible").default(true).notNull(),
	label: text("label").notNull(),
	value: text("value").notNull(),
	color: text("color").default('#000000').notNull(),
});

export const cart = pgTable("cart", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("userId").notNull(),
	courseId: uuid("courseId").notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		cartUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "cart_userId_User_id_fk"
		}),
		cartCourseIdCoursesIdFk: foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "cart_courseId_courses_id_fk"
		}),
	}
});

export const certification = pgTable("Certification", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	ownerId: uuid("ownerId").notNull(),
	certificateData: text("certificateData").notNull(),
	description: text("description"),
	isPublished: boolean("isPublished").default(false).notNull(),
	uniqueIdentifier: text("uniqueIdentifier").notNull(),
	title: text("title").default('').notNull(),
	expirationDate: timestamp("expirationDate", { mode: 'string' }),
	isRevocable: boolean("isRevocable").default(true).notNull(),
	metadata: text("metadata"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
	isDeleted: boolean("isDeleted").default(false).notNull(),
	deletedAt: timestamp("deletedAt", { mode: 'string' }),
	certificateId: uuid("certificateId").notNull(),
},
(table) => {
	return {
		certificationOwnerIdUserIdFk: foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "Certification_ownerId_User_id_fk"
		}),
		certificationCertificateIdCertificateWithPlaceholdersIdFk: foreignKey({
			columns: [table.certificateId],
			foreignColumns: [certificateWithPlaceholders.id],
			name: "Certification_certificateId_CertificateWithPlaceholders_id_fk"
		}),
		certificationUniqueIdentifierUnique: unique("Certification_uniqueIdentifier_unique").on(table.uniqueIdentifier),
	}
});

export const lectures = pgTable("lectures", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	chapterId: uuid("chapterId").notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	duration: varchar("duration", { length: 100 }).notNull(),
	videoUrl: varchar("videoUrl", { length: 500 }).notNull(),
	isPreview: boolean("isPreview").default(false),
	isLocked: boolean("isLocked").default(true),
	order: varchar("order", { length: 50 }),
},
(table) => {
	return {
		lecturesChapterIdChaptersIdFk: foreignKey({
			columns: [table.chapterId],
			foreignColumns: [chapters.id],
			name: "lectures_chapterId_chapters_id_fk"
		}).onDelete("cascade"),
	}
});

export const files = pgTable("files", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }),
	path: varchar("path", { length: 255 }),
	size: integer("size"),
	courseId: uuid("courseId"),
},
(table) => {
	return {
		filesCourseIdCoursesIdFk: foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "files_courseId_courses_id_fk"
		}),
	}
});

export const chapters = pgTable("chapters", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	courseId: uuid("courseId").notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	order: varchar("order", { length: 50 }),
	duration: varchar("duration", { length: 100 }).notNull(),
	questionnaireId: uuid("questionnaireId").notNull(),
},
(table) => {
	return {
		chaptersCourseIdCoursesIdFk: foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "chapters_courseId_courses_id_fk"
		}).onDelete("cascade"),
	}
});

export const quizAttempts = pgTable("quiz_attempts", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	questionnaireId: text("questionnaire_id").notNull(),
	score: integer("score").notNull(),
	answers: jsonb("answers").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const certificateWithPlaceholders = pgTable("CertificateWithPlaceholders", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	ownerId: uuid("ownerId").notNull(),
	certificateData: text("certificateData").notNull(),
	description: text("description"),
	isPublished: boolean("isPublished").default(false).notNull(),
	uniqueIdentifier: text("uniqueIdentifier").notNull(),
	title: text("title").default('').notNull(),
	expirationDate: timestamp("expirationDate", { mode: 'string' }),
	isRevocable: boolean("isRevocable").default(true).notNull(),
	metadata: text("metadata"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
	placeholderId: uuid("placeholderId"),
	placeholderValue: text("placeholderValue").notNull(),
	positionX: text("positionX").notNull(),
	positionY: text("positionY").notNull(),
	certificateId: uuid("certificateId").notNull(),
	isDeleted: boolean("isDeleted").default(false).notNull(),
	deletedAt: timestamp("deletedAt", { mode: 'string' }),
},
(table) => {
	return {
		certificateWithPlaceholdersOwnerIdUserIdFk: foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "CertificateWithPlaceholders_ownerId_User_id_fk"
		}),
		certificateWithPlaceholdersUniqueIdentifierUnique: unique("CertificateWithPlaceholders_uniqueIdentifier_unique").on(table.uniqueIdentifier),
	}
});

export const questions = pgTable("questions", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	questionnaireId: uuid("questionnaire_id"),
	question: text("question"),
	options: text("options"),
	correctAnswer: varchar("correct_answer", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		questionsQuestionnaireIdQuestionnairesIdFk: foreignKey({
			columns: [table.questionnaireId],
			foreignColumns: [questionnaires.id],
			name: "questions_questionnaire_id_questionnaires_id_fk"
		}),
	}
});

export const courseQuestionnaires = pgTable("course_questionnaires", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	courseId: uuid("course_id").notNull(),
	questionnaireId: uuid("questionnaire_id").notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		courseQuestionnairesCourseIdCoursesIdFk: foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "course_questionnaires_course_id_courses_id_fk"
		}),
		courseQuestionnairesQuestionnaireIdQuestionnairesIdFk: foreignKey({
			columns: [table.questionnaireId],
			foreignColumns: [questionnaires.id],
			name: "course_questionnaires_questionnaire_id_questionnaires_id_fk"
		}),
	}
});

export const certificateTracking = pgTable("CertificateTracking", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	certificateId: uuid("certificateId").notNull(),
	verificationCode: text("verificationCode").notNull(),
	holderName: text("holderName").notNull(),
	issueDate: timestamp("issueDate", { mode: 'string' }).notNull(),
	expiryDate: timestamp("expiryDate", { mode: 'string' }),
	lastVerifiedAt: timestamp("lastVerifiedAt", { mode: 'string' }),
	status: text("status").notNull(),
	grade: text("grade"),
	score: text("score"),
	digitalSignature: text("digitalSignature"),
	verificationHistory: text("verificationHistory"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		certificateTrackingCertificateIdCertificationIdFk: foreignKey({
			columns: [table.certificateId],
			foreignColumns: [certification.id],
			name: "CertificateTracking_certificateId_Certification_id_fk"
		}),
		certificateTrackingVerificationCodeUnique: unique("CertificateTracking_verificationCode_unique").on(table.verificationCode),
	}
});

export const managecertificates = pgTable("managecertificates", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	courseId: text("course_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	isDeleted: text("is_deleted").default('false').notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const questionnaires = pgTable("questionnaires", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	title: text("title").notNull(),
	courseId: text("course_id").notNull(),
	isRequired: boolean("is_required").default(true),
	minPassScore: integer("min_pass_score").default(80),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	chapterId: text("chapter_id"),
});