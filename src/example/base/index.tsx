import React from 'react';
import { CrudlEntity } from '~/application/modules/pages/CrudlEntity';
import api from '~/example/base/api';
import { BASE_FIELDS } from '~/example/base/fields';

export type IFields = {
  name: string;
  age: number;
  role: string;
  status: number;
};

export default new CrudlEntity<IFields>('Base', '/base', api, {
  fields: BASE_FIELDS,
});
