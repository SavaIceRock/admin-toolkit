/* Copyright (c) 2020 IceRock MAG Inc. Use of this source code is governed by the Apache 2.0 license. */

import {
  EMPTY_USER,
  IAuthProviderProps,
  AUTH_ERRORS,
} from '~/application/types/auth';
import { computed, observable, action, reaction, toJS } from 'mobx';
import { flow } from 'mobx';
import { AuthProvider } from '../AuthProvider';
import { Unwrap } from '~/application/types/common';

const EMPTY_TOKENS = {
  access: '',
  refresh: '',
};

export class JWTAuthProvider extends AuthProvider {
  @observable tokens: Record<string, string> = EMPTY_TOKENS;
  @observable authRequestFn?: (
    email: string,
    password: string
  ) => Promise<{
    user: IAuthProviderProps['user'];
    tokens: Record<string, string>;
    error: string;
  }>;

  constructor(fields?: Partial<IAuthProviderProps>) {
    super(fields);

    if (this.persist) {
      const { user, tokens } = this.getPersistedCredentials();

      if (user) {
        this.user = user;
      }

      if (tokens) {
        this.tokens = tokens;
      }

      reaction(() => this.tokens, this.persistTokens);
      reaction(() => this.user, this.persistCredentials);
    }
  }

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
      this: JWTAuthProvider
    ) {
      if (!this.authRequestFn) return;

      this.isLoading = true;

      try {
        const response: Unwrap<typeof this.authRequestFn> = yield this.authRequestFn(
          email,
          password
        );

        if (!response || response.error) {
          this.parent?.notifications.showError(
            response?.error || AUTH_ERRORS.CANT_LOGIN
          );
          throw new Error(response?.error);
        }

        this.parent?.notifications.hideNotification();
        this.user = response.user;
        this.tokens = response.tokens;
      } catch (e) {
        this.error = e;
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

  @action
  logout = () => {
    this.user = EMPTY_USER;
    this.tokens = EMPTY_TOKENS;
  };

  @observable
  withToken = async (req: any, args: any) => {
    return req({ ...args, token: `Bearer ${this.tokens.access}` });
  };

  getPersistedCredentials = (): {
    user?: IAuthProviderProps['user'];
    tokens?: Record<string, string>;
  } => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');

      if (typeof user != 'object') return {};

      return { user, tokens };
    } catch (e) {
      return {};
    }
  };

  persistCredentials = () => {
    localStorage.setItem('user', JSON.stringify(this.user));
  };

  persistTokens = () => {
    localStorage.setItem('tokens', JSON.stringify(this.tokens));
  };

  @computed
  get isLogged() {
    return !!this.tokens.access;
  }
}
