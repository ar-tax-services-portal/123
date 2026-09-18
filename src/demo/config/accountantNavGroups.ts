/**
 * A/R Tax Services, LLC - Accountant Dashboard Navigation Architecture
 * Strict compliance with the 20-item information architecture specification.
 */

import { NavGroup } from '../components/DashboardShell';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FolderOpen,
  FileSpreadsheet,
  FileCheck2,
  AlertOctagon,
  FileQuestion,
  GitCompare,
  ShieldCheck,
  CheckCircle2,
  FileBarChart,
  History,
  UserCheck,
  KeyRound,
  Sparkles,
  FileCog,
  Workflow,
  FlaskConical,
  Settings
} from 'lucide-react';

export const ACCOUNTANT_NAV_GROUPS: NavGroup[] = [
  {
    id: 'main',
    label: 'Main Practice Center',
    defaultExpanded: true,
    items: [
      { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
      { id: 'clients', label: '2. Clients', icon: Users },
      { id: 'tax_years', label: '3. Tax Years', icon: Calendar },
      { id: 'document_center', label: '4. Document Center', icon: FolderOpen },
      { id: 'workpapers', label: '5. Workpaper Center', icon: FileSpreadsheet },
      { id: 'tax_prep', label: '6. Tax Preparation', icon: FileCheck2 },
      { id: 'exceptions', label: '7. Exceptions', icon: AlertOctagon },
      { id: 'missing_docs', label: '8. Missing Documents', icon: FileQuestion },
      { id: 'prior_year', label: '9. Prior-Year Comparison', icon: GitCompare },
      { id: 'pre_filing_review', label: '10. Pre-Filing Review', icon: ShieldCheck },
      { id: 'filing_readiness', label: '11. Filing Readiness', icon: CheckCircle2 },
      { id: 'reports', label: '12. Reports', icon: FileBarChart },
      { id: 'audit_log', label: '13. Audit Log', icon: History }
    ]
  },
  {
    id: 'administration',
    label: 'Administration',
    defaultExpanded: true,
    items: [
      { id: 'team', label: '14. Team', icon: UserCheck },
      { id: 'permissions', label: '15. Roles & Permissions', icon: KeyRound },
      { id: 'ai_config', label: '16. AI Configuration', icon: Sparkles },
      { id: 'doc_rules', label: '17. Document Rules', icon: FileCog },
      { id: 'workflow_config', label: '18. Workflow Configuration', icon: Workflow },
      { id: 'demo_env', label: '19. Demo Environment', icon: FlaskConical },
      { id: 'settings', label: '20. System Settings', icon: Settings }
    ]
  }
];
