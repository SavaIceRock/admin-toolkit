/* Copyright (c) 2020 IceRock MAG Inc. Use of this source code is governed by the Apache 2.0 license. */

// import React from 'react';
import {
  EMPTY_USER,
  IAuthProviderProps,
  UNAUTHORIZED,
  WithTokenFunction,
} from '~/application/types/auth';
import { computed, observable, action, reaction, toJS } from 'mobx';
import { flow } from 'mobx';
import { CancellablePromise } from 'mobx/lib/api/flow';
import { Config } from '../../config/Config';

export class AuthProvider {
  // From props
  @observable parent?: Config;
  @observable user: IAuthProviderProps['user'] = EMPTY_USER;
  @observable authRequestFn?: IAuthProviderProps['authRequestFn'];
  @observable authPasswRestoreFn?: IAuthProviderProps['authPasswRestoreFn'];
  @observable authPasswUpdateFn?: IAuthProviderProps['authPasswUpdateFn'];
  @observable roleTitles?: Record<any, string>;
  @observable persist?: IAuthProviderProps['persist'] = true;
  @observable newPasswordValidator?: IAuthProviderProps['newPasswordValidator'];

  constructor(fields?: Partial<IAuthProviderProps>) {
    if (fields) {
      Object.assign(this, fields);
    }

    if (this.persist) {
      const { user } = this.getPersistedCredentials();

      if (user) {
        this.user = { ...EMPTY_USER, ...user };
      }

      reaction(() => this.user, this.persistCredentials);
    }
  }

  // Built-in
  @observable isLoading: boolean = false;
  @observable error: string = '';

  sendAuthRequestInstance?: CancellablePromise<any>;

  @action
  sendAuthRequest = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    this.sendAuthRequestCancel();

    this.sendAuthRequestInstance = flow(function* sendAuthRequest(
      this: AuthProvider
    ) {
      if (!this.authRequestFn) return;

      this.isLoading = true;

      try {
        const response = yield this.authRequestFn(email, password).catch(
          () => null
        );

        if (!response || response.error) {
          throw new Error(response.error);
        }

        this.user = response.user;
      } catch (e) {
        this.error = e;
        this.parent?.notifications.showError(e.toString());
      } finally {
        this.isLoading = false;
      }
    }).bind(this)();
  };

  sendAuthRequestCancel = () => {
    if (this.sendAuthRequestInstance && this.sendAuthRequestInstance.cancel) {
      this.sendAuthRequestInstance.cancel();
    }
  };

  sendAuthPasswRestoreInstance?: CancellablePromise<any>;

  @action
  sendAuthPasswRestore = ({ email }: { email: string }) => {
    this.sendAuthPasswRestoreCancel();

    this.sendAuthPasswRestoreInstance = flow(function* sendAuthPasswRestore(
      this: AuthProvider
    ) {
      if (!this.authPasswRestoreFn) return;

      this.isLoading = true;

      try {
        const response = yield this.authPasswRestoreFn(email).catch(() => null);

        if (!response || response.error) {
          throw new Error(response.error);
        }

        this.parent?.notifications.showSuccess('Check your email');
        this.parent?.history.push('/');
      } catch (e) {
        this.error = e;
        this.parent?.notifications.showError(e.toString());
      } finally {
        this.isLoading = false;
      }
    }).bind(this)();
  };

  sendAuthPasswRestoreCancel = () => {
    if (
      this.sendAuthPasswRestoreInstance &&
      this.sendAuthPasswRestoreInstance.cancel
    ) {
      try {
        this.sendAuthPasswRestoreInstance.cancel();
      } catch (e) {}
    }
  };

  sendAuthPasswUpdateInstance?: CancellablePromise<any>;

  @action
  sendAuthPasswUpdate = ({
    token,
    password,
    passwordRepeat,
  }: {
    token: string;
    password: string;
    passwordRepeat: string;
  }) => {
    this.sendAuthPasswRestoreCancel();

    this.sendAuthPasswUpdateInstance = flow(function* sendAuthPasswUpdate(
      this: AuthProvider
    ) {
      if (!this.authPasswUpdateFn) return;

      this.isLoading = true;

      try {
        if (password !== passwordRepeat) {
          throw new Error(`Passwords doesn't match`);
        }

        if (this.newPasswordValidator && this.newPasswordValidator(password)) {
          throw new Error(this.newPasswordValidator(password));
        }

        const response = yield this.authPasswUpdateFn(
          token,
          password,
          passwordRepeat
        ).catch(() => null);

        if (!response || response.error) {
          throw new Error(response.error);
        }

        this.parent?.notifications.showSuccess('You can now log in');
        this.parent?.history.push('/');
      } catch (e) {
        this.error = e;
        this.parent?.notifications.showError(e.toString());
      } finally {
        this.isLoading = false;
      }
    }).bind(this)();
  };

  sendAuthPasswUpdateCancel = () => {
    if (
      this.sendAuthPasswUpdateInstance &&
      this.sendAuthPasswUpdateInstance.cancel
    ) {
      try {
        this.sendAuthPasswUpdateInstance.cancel();
      } catch (e) {}
    }
  };

  getPersistedCredentials = (): { user?: IAuthProviderProps['user'] } => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (typeof user != 'object') return {};

      return { user };
    } catch (e) {
      return {};
    }
  };

  persistCredentials = () => {
    localStorage.setItem('user', JSON.stringify(this.user));
  };

  @action
  logout = () => {
    this.user = EMPTY_USER;
  };

  @action
  withToken: WithTokenFunction = async (req: any, args: any) => {
    const result = await req({ ...args, token: this.user.token });

    if (result.error === UNAUTHORIZED) {
      this.user = EMPTY_USER;
    }

    return result;
  };

  @computed
  get isLogged() {
    return !!this.user.token;
  }
}