export interface DashboardMenuItem {
  id: string;
  labelKey: string;
  path: string;
  iconName: string;
  roles?: ('user' | 'vendor' | 'admin')[];
  badge?: string | number;
  children?: DashboardMenuItem[];
}

export interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  description?: string;
  iconName?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  linkText?: string;
  linkPath?: string;
}

export interface DashboardSection {
  id: string;
  title: string;
  description?: string;
  cards: DashboardCard[];
}

export interface DashboardQuickAction {
  id: string;
  label: string;
  description?: string;
  iconName: string;
  path?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
}
