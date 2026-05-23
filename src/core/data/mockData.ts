/**
 * mockData.ts — Re-exports from demoData for backward compatibility.
 * When backend is connected, replace the imports in demoData.ts with API calls.
 */

export {
  DEMO_ALL_PROJECTS as allProjects,
  DEMO_FEATURED_PROJECTS as MOCK_PROJECTS,
  DEMO_PROJECT_BUILDERS as MOCK_BUILDERS,
  DEMO_COUNCIL_MEMBERS as MOCK_EXECUTIVES,
  DEMO_MEMBERS as MOCK_MEMBERS,
  DEMO_TIMELINE as MOCK_TIMELINE,
} from './demoData';

export type { DemoProject as Project } from './demoData';