import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from '../database/data-source-options.js';
import { IssuePriority } from '../issues/issue-priority.enum.js';
import { IssueStatus } from '../issues/issue-status.enum.js';
import { Issue } from '../issues/issue.entity.js';
import { ProjectPriority } from '../projects/project-priority.enum.js';
import { ProjectStatus } from '../projects/project-status.enum.js';
import { Project } from '../projects/project.entity.js';
import { ReleaseStatus } from '../releases/release-status.enum.js';
import { Release } from '../releases/release.entity.js';
import { User } from '../users/user.entity.js';

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
}

const dataSource = new DataSource(buildDataSourceOptions(process.env.DATABASE_URL!));
await dataSource.initialize();
await dataSource.runMigrations();

if ((await dataSource.getRepository(User).count()) > 0) {
  console.log('Database already has data, skipping seed');
  await dataSource.destroy();
  process.exit(0);
}

const DEV_PASSWORD = 'password123';
const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);

const users = await dataSource.getRepository(User).save([
  { name: 'Ada Lovelace', email: 'ada@example.com', color: '#e5484d', passwordHash },
  { name: 'Grace Hopper', email: 'grace@example.com', color: '#30a46c', passwordHash },
  { name: 'Linus Torvalds', email: 'linus@example.com', color: '#f5a524', passwordHash },
  { name: 'Margaret Hamilton', email: 'margaret@example.com', color: '#5e6ad2', passwordHash },
]);
const [ada, grace, linus, margaret] = users;

const projectRepo = dataSource.getRepository(Project);
const releaseRepo = dataSource.getRepository(Release);
const issueRepo = dataSource.getRepository(Issue);

const web = await projectRepo.save({
  name: 'Web App',
  key: 'WEB',
  description: 'The customer-facing web application.',
  status: ProjectStatus.IN_PROGRESS,
  priority: ProjectPriority.HIGH,
  leadId: ada.id,
  startDate: daysFromNow(-30),
  targetDate: daysFromNow(60),
});
const mobile = await projectRepo.save({
  name: 'Mobile App',
  key: 'MOB',
  description: 'Native iOS and Android clients.',
  status: ProjectStatus.PLANNED,
  priority: ProjectPriority.MEDIUM,
  leadId: grace.id,
  startDate: daysFromNow(10),
  targetDate: daysFromNow(120),
});

await dataSource.query(`INSERT INTO project_members (project_id, user_id) VALUES ($1, $2), ($1, $3), ($4, $5), ($4, $6)`, [
  web.id,
  ada.id,
  linus.id,
  mobile.id,
  grace.id,
  margaret.id,
]);

const [launch, polish, redesign] = await releaseRepo.save([
  { projectId: web.id, name: 'Launch', version: 'v1.0', description: 'First public release.', status: ReleaseStatus.COMPLETED, targetDate: daysFromNow(-20), releasedAt: new Date(Date.now() - 20 * 86_400_000) },
  { projectId: web.id, name: 'Polish', version: 'v1.1', description: 'Bug fixes and small improvements.', status: ReleaseStatus.IN_PROGRESS, targetDate: daysFromNow(14) },
  { projectId: web.id, name: 'Redesign', version: 'v2.0', description: 'New navigation and visual refresh.', status: ReleaseStatus.PLANNED, targetDate: daysFromNow(75) },
]);
const [mobileBeta] = await releaseRepo.save([
  { projectId: mobile.id, name: 'Beta', version: '0.9', description: 'TestFlight beta.', status: ReleaseStatus.PLANNED, targetDate: daysFromNow(45) },
]);

type SeedIssue = Partial<Omit<Issue, 'id' | 'projectId' | 'number'>> & { title: string };

async function seedIssues(project: Project, issues: { issue: SeedIssue; subIssues?: SeedIssue[] }[]): Promise<void> {
  let counter = 0;
  const insert = (issue: SeedIssue, parentId: string | null) =>
    issueRepo.save({
      ...issue,
      projectId: project.id,
      number: ++counter,
      parentId,
      completedAt: issue.status === IssueStatus.DONE ? new Date() : null,
    });

  for (const { issue, subIssues } of issues) {
    const parent = await insert(issue, null);
    for (const sub of subIssues ?? []) {
      await insert({ releaseId: parent.releaseId, ...sub }, parent.id);
    }
  }
  await projectRepo.update(project.id, { issueCounter: counter });
}

await seedIssues(web, [
  {
    issue: { title: 'Set up authentication', status: IssueStatus.DONE, priority: IssuePriority.HIGH, assigneeId: ada.id, releaseId: launch.id },
    subIssues: [
      { title: 'Email and password sign in', status: IssueStatus.DONE, priority: IssuePriority.HIGH, assigneeId: ada.id },
      { title: 'Password reset flow', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, assigneeId: linus.id },
    ],
  },
  {
    issue: { title: 'Project dashboard', status: IssueStatus.DONE, priority: IssuePriority.HIGH, assigneeId: margaret.id, releaseId: launch.id },
  },
  {
    issue: { title: 'Keyboard shortcuts', description: 'Add shortcuts for creating issues and changing status.', status: IssueStatus.IN_PROGRESS, priority: IssuePriority.MEDIUM, assigneeId: ada.id, releaseId: polish.id, dueDate: daysFromNow(7) },
    subIssues: [
      { title: 'Global create-issue shortcut', status: IssueStatus.DONE, assigneeId: ada.id },
      { title: 'Status picker shortcut', status: IssueStatus.IN_PROGRESS, assigneeId: ada.id },
      { title: 'Shortcut help dialog', status: IssueStatus.TODO },
    ],
  },
  {
    issue: { title: 'Fix layout shift when list loads', status: IssueStatus.IN_REVIEW, priority: IssuePriority.URGENT, assigneeId: linus.id, releaseId: polish.id },
  },
  {
    issue: { title: 'Improve empty states', status: IssueStatus.TODO, priority: IssuePriority.LOW, releaseId: polish.id },
  },
  {
    issue: { title: 'New sidebar navigation', description: 'Collapsible sections, favorites and recent items.', status: IssueStatus.BACKLOG, priority: IssuePriority.MEDIUM, releaseId: redesign.id },
    subIssues: [
      { title: 'Collapsible sections', status: IssueStatus.BACKLOG },
      { title: 'Favorites list', status: IssueStatus.BACKLOG },
    ],
  },
  {
    issue: { title: 'Dark mode', status: IssueStatus.BACKLOG, priority: IssuePriority.LOW, releaseId: redesign.id },
  },
  {
    issue: { title: 'Legacy CSV export', status: IssueStatus.CANCELED, priority: IssuePriority.NO_PRIORITY },
  },
]);

await seedIssues(mobile, [
  {
    issue: { title: 'Push notifications', status: IssueStatus.TODO, priority: IssuePriority.HIGH, assigneeId: grace.id, releaseId: mobileBeta.id },
    subIssues: [
      { title: 'Register device tokens', status: IssueStatus.TODO },
      { title: 'Notification preferences screen', status: IssueStatus.BACKLOG },
    ],
  },
  {
    issue: { title: 'Offline mode', status: IssueStatus.BACKLOG, priority: IssuePriority.MEDIUM },
  },
]);

const labelRows: { id: string; name: string }[] = await dataSource.query(`SELECT id, name FROM labels`);
const labelIdByName = new Map(labelRows.map((row) => [row.name, row.id]));
async function tagIssue(title: string, labelNames: string[]): Promise<void> {
  const [row] = await issueRepo.find({ where: { title }, select: { id: true } });
  if (!row) {
    return;
  }
  for (const name of labelNames) {
    const labelId = labelIdByName.get(name);
    if (labelId) {
      await dataSource.query(`INSERT INTO issue_labels (issue_id, label_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [
        row.id,
        labelId,
      ]);
    }
  }
}
await tagIssue('Fix layout shift when list loads', ['Bug']);
await tagIssue('Keyboard shortcuts', ['Feature']);
await tagIssue('New sidebar navigation', ['Feature']);
await tagIssue('Improve empty states', ['Improvement']);
await tagIssue('Dark mode', ['Feature', 'Improvement']);
await tagIssue('Push notifications', ['Feature']);

console.log('Seeded users, projects, releases and issues');
console.log(`Log in as any seeded user with password "${DEV_PASSWORD}", e.g. ada@example.com`);
await dataSource.destroy();
