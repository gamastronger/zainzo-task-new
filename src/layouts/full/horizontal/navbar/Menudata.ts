import {
  IconLayoutKanban
} from '@tabler/icons-react';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Kanban',
    icon: IconLayoutKanban,
    href: '/app',
  },
];
export default Menuitems;
