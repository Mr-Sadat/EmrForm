import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import * as jalaali from 'jalaali-js';

@Injectable()
export class PersianDateAdapter extends DateAdapter<Date> {

  constructor() {
    super();
    this.setLocale('fa-IR');
  }

  getYear(date: Date): number {
    return jalaali.toJalaali(date).jy;
  }

  getMonth(date: Date): number {
    return jalaali.toJalaali(date).jm - 1;
  }

  getDate(date: Date): number {
    return jalaali.toJalaali(date).jd;
  }

  getDayOfWeek(date: Date): number {
    return date.getDay();
  }

  getMonthNames(): string[] {
    return [
      'فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور',
      'مهر','آبان','آذر','دی','بهمن','اسفند'
    ];
  }

  getDayOfWeekNames(): string[] {
    return ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];
  }

  getDateNames(): string[] {
    return Array.from({ length: 31 }, (_, i) => String(i + 1));
  }

  getYearName(date: Date): string {
    return this.getYear(date).toString();
  }

  getFirstDayOfWeek(): number {
    return 6; // شنبه
  }

  getNumDaysInMonth(date: Date): number {
    const j = jalaali.toJalaali(date);
    return jalaali.jalaaliMonthLength(j.jy, j.jm);
  }

  clone(date: Date): Date {
    return new Date(date.getTime());
  }

  createDate(year: number, month: number, date: number): Date {
    const g = jalaali.toGregorian(year, month + 1, date);
    return new Date(g.gy, g.gm - 1, g.gd);
  }

  today(): Date {
    return new Date();
  }

  parse(value: any): Date | null {
    if (!value) return null;
    const [y, m, d] = value.split('/').map(Number);
    const g = jalaali.toGregorian(y, m, d);
    return new Date(g.gy, g.gm - 1, g.gd);
  }

  format(date: Date): string {
    if (!this.isValid(date)) return '';
    const j = jalaali.toJalaali(date);
    return `${j.jy}/${String(j.jm).padStart(2,'0')}/${String(j.jd).padStart(2,'0')}`;
  }

  addCalendarYears(date: Date, years: number): Date {
    const j = jalaali.toJalaali(date);
    return this.createDate(j.jy + years, j.jm - 1, j.jd);
  }

  addCalendarMonths(date: Date, months: number): Date {
    const j = jalaali.toJalaali(date);
    let total = j.jm - 1 + months;
    let year = j.jy + Math.floor(total / 12);
    let month = total % 12;
    if (month < 0) {
      month += 12;
      year--;
    }
    return this.createDate(year, month, j.jd);
  }

  addCalendarDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  toIso8601(date: Date): string {
    return date.toISOString();
  }

  isDateInstance(obj: any): boolean {
    return obj instanceof Date;
  }

  isValid(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  invalid(): Date {
    return new Date(NaN);
  }
}
