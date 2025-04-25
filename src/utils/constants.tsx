
import { addDays } from 'date-fns';

export const tags = [
    {
        id: 1,
        name: 'contact us',
        checked: false
    },
    {
        id: 2,
        name: 'mobile user',
        checked: false
    },
    {
        id: 3,
        name: 'app',
        checked: false
    },
    {
        id: 4,
        name: 'App User',
        checked: false
    },
    {
        id: 5,
        name: 'workbook',
        checked: false
    },
    {
        id: 6,
        name: 'contact rep',
        checked: false
    }
]

export const defaultDate ={
          startDate: new Date(),
          endDate: addDays(new Date(), 0),
          key: 'selection'
        }