/* Copyright (c) 2020 IceRock MAG Inc. Use of this source code is governed by the Apache 2.0 license. */

import React, { useMemo, Fragment } from 'react';
import { Config } from '../Config';
import { observer } from 'mobx-react';
import { Switch, Route, Redirect, Router } from 'react-router-dom';
import { SignIn } from '~/containers/login/SignIn';
import { Navigation } from '~/containers/layout/Navigation';
import { PageRenderer } from '../PageRenderer';
import {
  Container,
  WithStyles,
  withStyles,
  CssBaseline,
  ThemeProvider,
} from '@material-ui/core';
import styles from './styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { toJS } from 'mobx';

type IProps = WithStyles<typeof styles> & {
  config: Config;
};

const Application = withStyles(styles)(
  observer(({ classes, config }: IProps) => {
    console.log(
      config?.pages.map((page) => toJS(page.roles)),
      config?.auth?.user?.role
    );

    config.pages.map((page) => {
      console.log({
        url: page?.menu?.url,
        user: toJS(config.auth?.user),
        role: config.auth?.user?.role,
        roles: toJS(page.roles),
        all: page.roles?.all?.includes(config.auth?.user?.role || ''),
        list: page.roles?.list?.includes(config.auth?.user?.role || ''),
        filter:
          page?.menu?.url &&
          (!page.roles ||
            (config.auth?.user?.role &&
              (page.roles?.all?.includes(config.auth?.user?.role) ||
                page.roles?.list?.includes(config.auth?.user?.role)))),
      });
    });

    const links = useMemo(
      () =>
        config.pages
          .filter((page) => page?.menu?.url && page.canList)
          .map((page) => ({
            name: page.menu.label,
            url: page.menu.url,
          })),
      [config.pages, config.auth?.user?.role]
    );

    if (!config.auth?.isLogged && config.auth?.sendAuthRequest) {
      return (
        <Fragment>
          <CssBaseline />

          <SignIn
            onSubmit={config.auth.sendAuthRequest}
            onForgotScreenClick={console.log}
          />

          <config.notifications.Output />
        </Fragment>
      );
    }

    return (
      <ThemeProvider theme={config.theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <CssBaseline />

          <Router history={config.history}>
            <Navigation
              links={links}
              logo={{ url: config.logo, title: config.title }}
              account={config.auth?.user}
              onLogout={config.auth?.logout}
            />

            <Container maxWidth="xl" className={classes.wrapper}>
              <Switch>
                {config.pages
                  .filter((page) => page?.menu?.url)
                  .map((page) => (
                    <Route
                      path={page.menu.url}
                      render={() => <PageRenderer page={page} />}
                      key={page.menu.url}
                    />
                  ))}
                {links.length > 0 && <Redirect to={links[0].url} />}
              </Switch>
            </Container>
          </Router>

          <config.notifications.Output />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    );
  })
);

export { Application };
