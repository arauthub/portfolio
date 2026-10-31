import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CourseListComponent } from './features/courses/course-list.component';
import { CourseDetailComponent } from './features/courses/course-detail.component';
import { SkillTreeComponent } from './features/skill-tree/skill-tree.component';
import { QuestsComponent } from './features/quests/quests.component';
import { OrgSetupComponent } from './features/organization/org-setup.component';
import { InstructorComponent } from './features/instructor/instructor.component';
import { CertificateComponent } from './features/certificate/certificate.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Synapse LMS // Mission Command' },
  { path: 'courses', component: CourseListComponent, title: 'Synapse LMS // Curriculum Tracks' },
  { path: 'courses/:slug', component: CourseDetailComponent, title: 'Synapse LMS // Mission Deck' },
  { path: 'skill-tree', component: SkillTreeComponent, title: 'Synapse LMS // Neural Skill Web' },
  { path: 'quests', component: QuestsComponent, title: 'Synapse LMS // Cyber Bounties' },
  { path: 'org-setup', component: OrgSetupComponent, title: 'Synapse LMS // White-Label Setup' },
  { path: 'instructor', component: InstructorComponent, title: 'Synapse LMS // Educator Studio' },
  { path: 'certificate', component: CertificateComponent, title: 'Synapse LMS // Cryptographic Certificate' },
  { path: '**', redirectTo: 'dashboard' }
];
