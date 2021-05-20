/* Copyright (c) 2020-2021 IceRock MAG Inc. Use of this source code is governed by the Apache 2.0 license. */

import { JWTAuthProvider } from '~/application';
import { Unwrap } from '~/application/types/common';
import { IJWTAuthRequestFn } from '~/application';
import splash from '../../assets/logo512.png';
import {
  ADMIN_USER_EMAIL,
  ADMIN_USER_PASSWORD,
  ADMIN_USER_RESPONSE_JWT,
  COMMON_USER_EMAIL,
  COMMON_USER_PASSWORD,
  COMMON_USER_RESPONSE_JWT
} from "../__mocks__/authData";
import CustomError from "../__mocks__/CustomError";
import { AuthCustomLayout } from "../../layout/auth/AuthCustomLayout";

export default new JWTAuthProvider({
  layout: AuthCustomLayout,

  authRequestFn: (
    email: string,
    password: string
  ): Unwrap<ReturnType<IJWTAuthRequestFn>> =>
    new Promise((resolve) => {
      console.info('Authenticating with: ', {email, password});

      if (email === ADMIN_USER_EMAIL && password === ADMIN_USER_PASSWORD) {
        resolve(ADMIN_USER_RESPONSE_JWT)
      } else if (email === COMMON_USER_EMAIL && password === COMMON_USER_PASSWORD) {
        resolve(COMMON_USER_RESPONSE_JWT)
      } else {
        throw new CustomError('Error', 'Wrong login or password');
      }
    }),

  authPasswRestoreFn: (email: string) =>
    new Promise((resolve) => {
      console.info('Restoring password with: ', {email});
      resolve({error: ''});
    }),

  authPasswUpdateFn: (token, password, passwordRepeat) =>
    new Promise((resolve) => {
      console.info('Resetting password with: ', {
        token,
        password,
        passwordRepeat,
      });
      resolve({error: ''});
    }),

  tokenRefreshFn: (refresh: string) => {
    console.info(`Refreshing JWT tokens with refresh: ${refresh}`);
    const seed = Math.random() * 65535;
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            access: `accessToken_${seed}`,
            refresh: `refreshToken_${seed}`,
          }),
        3000
      )
    );
  },

  passwordValidator: (password: string) =>
    password.length > 5 ? '' : 'Password must be at least 6 symbols long',

  authSignupFn: (data: any) =>
    new Promise((resolve) => {
      console.info('Registering user with data ', data);
      resolve({error: ''});
    }),

  splash,
});
