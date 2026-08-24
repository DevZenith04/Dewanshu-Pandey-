import {
  BookOpen,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  MapPinned,
} from 'lucide-react';
import type { ElementType } from 'react';
import type { ViewTab } from '../types';

export interface NavItem {
  id: ViewTab;
  label: string;
  icon: ElementType;
  hint: string;
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, hint: 'National pulse' },
  { id: 'projects', label: 'Project desk', icon: FolderKanban, hint: 'Active acquisition' },
  { id: 'analysis', label: 'Risk studio', icon: Gauge, hint: 'Model signals' },
  { id: 'registry', label: 'Parcel registry', icon: MapPinned, hint: 'Cadastral records' },
  { id: 'archive', label: 'Archive', icon: BookOpen, hint: 'Closed cases' },
];
