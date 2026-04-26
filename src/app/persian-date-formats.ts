import { MatDateFormats } from '@angular/material/core';

export const PERSIAN_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY/MM/DD'
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY MMMM',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY MMMM'
  }
};
