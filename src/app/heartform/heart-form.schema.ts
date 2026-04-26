/* ===================== Types ===================== */

export type HeartPart =
  | 'RA'
  | 'RV'
  | 'LA'
  | 'LV'
  | 'IS'
  | 'AL'
  | 'STML'
  | 'ATVL'
  | 'PMVL'
  | 'AMVL';

export type FieldType =
 | `severity${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`
 | 'number'
 | 'textarea';

export interface HeartField {
  name: string;
  label: string;
  type: FieldType;
  default?: any;
}

export interface HeartFormSchema {
  title: string;
  fields: HeartField[];
}
export const HEART_FORM_SCHEMAS: Record<string, HeartFormSchema> = {
  LA: {
    title: 'دهلیز چپ',
    fields: [
      {
        name: 'laSize',
        label: 'اندازه دهلیزچپ',
        type: 'severity1',
        default: '0',
      },
      {
        name: 'leftAtrialPressure',
        label: 'فشار تخمینی دهلیزچپ',
        type: 'number',
      },
      { name: 'laThrombusPresent', label: 'وجودلخته', type: 'severity2' },
      {
        name: 'laSpontaneousEchoContrast',
        label: 'وجودحرکت دود مانند',
        type: 'severity3',
      },
      { name: 'laDescription', label: 'توضیحات', type: 'textarea' },
      { name: 'leftRaaThrombuspresent', label: 'وجودلخته', type: 'severity2' },
      {
        name: 'leftRaaSpontaneousEchoContrast',
        label: 'وجودحرکت دود مانند',
        type: 'severity3',
      },
      { name: 'leftRaaFlowVelocity', label: 'سرعت جریان', type: 'number' },
      { name: 'leftRaaShape', label: 'شکل ضمیمه', type: 'severity3' },
      { name: 'laRaaDescription', label: 'توضیحات', type: 'textarea' },
    ],
  },

  RA: {
    title: 'دهلیزراست',
    fields: [
      {
        name: 'raSize',
        label: 'اندازه دهلیز راست',
        type: 'severity1',
        default: '0',
      },
      {
        name: 'rightAtrialPressure',
        label: 'فشار تخمینی دهلیز راست',
        type: 'number',
      },
      { name: 'raThrombusPresent', label: 'وجودلخته', type: 'severity2' },
      {
        name: 'raSpontaneousEchoContrast',
        label: 'وجودحرکت دود مانند',
        type: 'severity3',
      },
      { name: 'raDescription', label: 'توضیحات', type: 'textarea' },
      { name: 'rightRaaThrombuspresent', label: 'وجودلخته', type: 'severity2' },
      {
        name: 'rightRaaSpontaneousEchoContrast',
        label: 'وجودحرکت دود مانند',
        type: 'severity3',
      },
      { name: 'rightRaaFlowVelocity', label: 'سرعت جریان', type: 'number' },
      { name: 'rightRaaShape', label: 'شکل ضمیمه', type: 'severity3' },
      { name: 'raRaaDescription', label: 'توضیحات', type: 'textarea' },
    ],
  },
  RV: {
    title: 'بطن راست',
    fields: [
      { name: 'rvSize', label: 'اندازه', type: 'severity5' },
      { name: 'rvEF', label: 'عملکرد انقباضی(EF)', type: 'number' },
      { name: 'rvWallMotion', label: 'حرکات دیواره', type: 'severity6' },
      { name: 'rvThrombus', label: 'لخته داخل بطن', type: 'severity2' },
      { name: 'rvDesc', label: 'توضیحات', type: 'textarea' },
    ],
  },
  IS: {
    title: 'تیغه بین دهلیزی',
    fields: [
      { name: 'IsThickness', label: 'ضخامت', type: 'severity7' },
      { name: 'sputumDefect', label: 'نقص سپتوم(ASD/PFO)', type: 'severity2' },
      { name: 'ISShunt', label: 'نوع شانت', type: 'severity8' },
      { name: 'ISDescription', label: 'توضیحات', type: 'textarea' },
    ],
  },
  LV: {
    title: 'بطن چپ',
    fields: [
      { name: 'lvSize', label: 'اندازه', type: 'severity5' },
      { name: 'lvEF', label: 'عملکرد انقباضی(EF)', type: 'number' },
      { name: 'lvWallMotion', label: 'حرکات دیواره', type: 'severity6' },
      { name: 'lvThrombus', label: 'لخته داخل بطن', type: 'severity2' },
      { name: 'lvDesc', label: 'توضیحات', type: 'textarea' },
    ],
  },
  AL: {
    title: 'برگچه قدامی',
    fields: [
      { name: 'ALThickness', label: 'ضخامت', type: 'severity9' },
      { name: 'ALMotion', label: 'حرکت', type: 'severity10' },
      { name: 'ALRegurgutation', label: 'نارسایی', type: 'severity3' },
      { name: 'ALStenosis', label: 'تنگی(MS)', type: 'severity3' },
      { name: 'AlDesc', label: 'توضیحات', type: 'textarea' },
    ],
  },
  AMVL: {
    title: 'برگچه قدامی میترال',
    fields: [
      { name: 'AMVLThickness', label: 'ضخامت', type: 'severity9' },
      { name: 'AMVLMotion', label: 'حرکت', type: 'severity10' },
      { name: 'AMVLRegurgutation', label: 'نارسایی', type: 'severity3' },
      { name: 'AMVLStenosis', label: 'تنگی(MS)', type: 'severity3' },
      { name: 'AMVLDesc', label: 'توضیحات', type: 'textarea' },
    ],
  },
  STML: {
    title: 'برگچه تیغه ای یا سپتال',
    fields: [
      { name: 'STMLThickness', label: 'ضخامت', type: 'severity11' },
      { name: 'STMLMotion', label: 'حرکت', type: 'severity12' },
      { name: 'STMLRegurgutation', label: 'نارسایی', type: 'severity3' },
      { name: 'STMLStenosis', label: 'تنگی', type: 'severity3' },
      { name: 'STMLDesc', label: 'توضیحات', type: 'textarea' },
    ],
  },
  ATVL: {
    title: 'برگچه قدامی دریچه سه لتی',
    fields: [
      { name: 'ATVLThickness', label: 'ضخامت', type: 'severity11' },
      { name: 'ATVLMotion', label: 'حرکت', type: 'severity12' },
      { name: 'ATVLRegurgutation', label: 'نارسایی', type: 'severity3' },
      { name: 'ATVLStenosis', label: 'تنگی', type: 'severity3' },
      { name: 'ATVLDesc', label: 'توضیحات', type: 'textarea' },
    ],
  },
  PMVL: {
    title: 'برگچه خلفی میترال',
    fields: [
      { name: 'PMVLThickness', label: 'ضخامت', type: 'severity9' },
      { name: 'PMVLMotion', label: 'حرکت', type: 'severity10' },
      { name: 'PMVLRegurgutation', label: 'نارسایی', type: 'severity3' },
      { name: 'PMVLStenosis', label: 'تنگی(MS)', type: 'severity3' },
      { name: 'PMVLDesc', label: 'توضیحات', type: 'textarea' },
    ],
  },
};



