import {
  IconLayoutKanban
} from '@tabler/icons-react';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Zainzo Task',
    icon: IconLayoutKanban,
    href: '/app',
  },
];
export default Menuitems;
