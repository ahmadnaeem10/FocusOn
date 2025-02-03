import { Module } from '@nestjs/common';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DrizzleModule } from './modules/drizzle/drizzle.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { OnAppInitModule } from './modules/on-app-init/on-app-init.module';
import { JwtAndRoleGuard } from './modules/auth/guards/jwt-and-role.guard';
import { EmailModule } from './modules/email/email.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { IssuesModule } from './modules/issues/issues.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { SolutionsModule } from './modules/solutions/solutions.module';
import { RecordsModule } from './modules/records/records.module';
import { FilesModule } from './modules/files/files.module';
import { PiecesModule } from './modules/pieces/pieces.module';
import { GoalsModule } from './modules/goals/goals.module';
import { GoalRecordsModule } from './modules/goal-records/goal-records.module';
import { AnswersModule } from './modules/answers/answers.module';
import emailConfig from './config/email.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, emailConfig],
      envFilePath: ['.env'],
    }),
    DrizzleModule,
    UsersModule,
    AuthModule,
    RoleModule,
    OnAppInitModule,
    EmailModule,
    CategoriesModule,
    IssuesModule,
    QuestionsModule,
    SolutionsModule,
    RecordsModule,
    PiecesModule,
    GoalsModule,
    GoalRecordsModule,
    AnswersModule,
    FilesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAndRoleGuard,
    },
  ],
})
export class AppModule {}
