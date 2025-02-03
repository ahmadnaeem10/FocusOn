import {
  integer,
  serial,
  text,
  pgTable,
  timestamp,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('user', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),
  fullName: text('full_name'),
  password: text('password'),
  verified: boolean('verify'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  roleId: integer('role_id'),
});

export const role = pgTable('role', {
  id: serial('id').primaryKey(),
  name: text('name').unique(),
});

export const refreshToken = pgTable('refresh_token', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const refreshTokenRelations = relations(refreshToken, ({ one }) => ({
  user: one(users, {
    fields: [refreshToken.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  user_role: one(role, {
    fields: [users.roleId],
    references: [role.id],
  }),
  password_code: one(passwordCode, {
    fields: [users.id],
    references: [passwordCode.userId],
  }),
  verification_code: one(verificationCode, {
    fields: [users.id],
    references: [verificationCode.userId],
  }),
  categories: many(categories),
  issues: many(issues),
  records: many(records),
  pieces: many(pieces),
  goals: many(goals),
  goalRecords: many(goalRecords),
}));

export const verificationCode = pgTable('verification_code', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 255 }),
  expiresAt: timestamp('expiresAt'),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export const passwordCode = pgTable('password_code', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 255 }),
  expiresAt: timestamp('expiresAt'),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export const issues = pgTable('issues', {
  id: serial('id').primaryKey(),
  title: text('title'),
  image: text('image'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  categoryId: integer('category_id').references(() => categories.id, {
    onDelete: 'cascade',
  }),
  recordId: integer('record_id').references(() => records.id, {
    onDelete: 'cascade',
  }),
  pieceId: integer('piece_id').references(() => pieces.id, {
    onDelete: 'cascade',
  }),
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  name: text('name'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  categoryId: integer('category_id').references(() => categories.id, {
    onDelete: 'cascade',
  }),
  type: text('type'),
});

export const answers = pgTable('answers', {
  id: serial('id').primaryKey(),
  answer: text('answer'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  questionId: integer('questionId').references(() => questions.id, {
    onDelete: 'cascade',
  }),
  issueId: integer('issue_id').references(() => issues.id, {
    onDelete: 'cascade',
  }),
});

export const solutions = pgTable('solutions', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  active: boolean('active'),
  result: text('result'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  issueId: integer('issue_id').references(() => issues.id, {
    onDelete: 'cascade',
  }),
});

export const records = pgTable('records', {
  id: serial('id').primaryKey(),
  name: text('name'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  issueId: integer('issue_id').references(() => issues.id, {
    onDelete: 'cascade',
  }),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  takeNumber: integer('take_number').notNull(),
  audioUrl: text('audio_url').notNull(),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  users: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  issues: many(issues),
  questions: many(questions),
}));

export const issuesRelations = relations(issues, ({ one, many }) => ({
  category: one(categories, {
    fields: [issues.categoryId],
    references: [categories.id],
  }),
  solutions: many(solutions),
  record: one(records, {
    fields: [issues.recordId],
    references: [records.id],
  }),
  piece: one(pieces, {
    fields: [issues.pieceId],
    references: [pieces.id],
  }),
  answers: many(answers),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  answers: many(answers),
  category: one(categories, {
    fields: [questions.categoryId],
    references: [categories.id],
  }),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
  issue: one(issues, {
    fields: [answers.issueId],
    references: [issues.id],
  }),
}));

export const recordsRelations = relations(records, ({ many }) => ({
  issues: many(issues),
}));

export const pieces = pgTable('pieces', {
  id: serial('id').primaryKey(),
  name: text('name'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export const piecesRelations = relations(pieces, ({ many }) => ({
  issues: many(issues),
}));

export const goals = pgTable('goals', {
  id: serial('id').primaryKey(),
  name: text('name'),
  count: integer('count'),
  goodCount: integer('good_count'),
  wrongCount: integer('wrong_count'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export const goalRecords = pgTable('goal_records', {
  id: serial('id').primaryKey(),
  name: text('name'),
  fileName: text('file_name'),
  order: integer('order'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  goalId: integer('goal_id').references(() => goals.id, {
    onDelete: 'cascade',
  }),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export const goalsRelations = relations(goals, ({ many }) => ({
  goalRecords: many(goalRecords),
}));

export const userInfo = pgTable('user_info', {
  isOnboarded: boolean('is_onboarded'),
  musicianLevel: text('musician_level'),
  helpWith: text('help_with').array(),
  feelAboutPractising: text('feel_about_practising'),
  planSkills: text('plan_skills'),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  appLaunchCount: integer('app_launch_count').default(0),
  lastRatingPrompt: timestamp('last_rating_prompt'),
});

export const userInfoRelations = relations(userInfo, ({ one }) => ({
  user: one(users, {
    fields: [userInfo.userId],
    references: [users.id],
  }),
}));
