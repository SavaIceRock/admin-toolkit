/* Copyright (c) 2020 IceRock MAG Inc. Use of this source code is governed by the Apache 2.0 license. */

import { IConfigProps } from '~/application/types/config';
import { Theme, createMuiTheme } from '@material-ui/core';
import { createBrowserHistory } from 'history';
import { Notifications } from '../../common/Notification';

export class Config {
  name: IConfigProps['name'] = '';
  pages: IConfigProps['pages'] = [];
  auth?: IConfigProps['auth'];
  logo?: IConfigProps['logo'];
  title?: IConfigProps['title'];
  theme: Theme = createMuiTheme({});
  history = createBrowserHistory();
  notifications = new Notifications();

  constructor(fields?: Partial<IConfigProps>) {
    if (fields) {
      Object.assign(this, fields);
    }

    if (this.pages.length) {
      this.pages.forEach((page) => {
        page.parent = this;
      });
    }

    if (this.auth) {
      this.auth.parent = this;
    }
  }
}