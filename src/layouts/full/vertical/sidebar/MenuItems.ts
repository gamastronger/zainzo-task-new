import { uniqueId } from 'lodash';
import React from 'react';
import { IconLayoutKanban } from '@tabler/icons-react';

export type SidebarIcon = React.FC<React.SVGProps<SVGSVGElement>>;

export interface MenuitemsType {
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: SidebarIcon;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'filled' | 'outlined';
  external?: boolean;
}

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: 'Apps',
  },
  {
    id: uniqueId(),
    title: 'Zainzo Task',
    icon: IconLayoutKanban,
    href: '/app',
  },
];

export default Menuitems;
