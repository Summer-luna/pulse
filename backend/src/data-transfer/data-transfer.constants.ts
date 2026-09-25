// Parent tables before the tables that reference them, so INSERTs satisfy foreign keys.
// `issues.parent_id` self-references the same table, so it's inserted as NULL and
// backfilled in a second pass (see DataTransferRepository.restoreTables).
export const DATA_TABLES = [
  'users',
  'teams',
  'customers',
  'projects',
  'labels',
  'release_pipelines',
  'releases',
  'project_members',
  'issues',
  'issue_labels',
  'comments',
  'requests',
] as const;

export const ISSUES_SELF_REF_COLUMN = 'parent_id';
