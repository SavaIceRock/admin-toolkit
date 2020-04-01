/* Copyright (c) 2020 IceRock MAG Inc. Use of this source code is governed by the Apache 2.0 license. */

import React, { FC, MouseEventHandler, useCallback } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

type IProps = {
  label: string;
  value: any;
  isEditing?: boolean;
  handler?: (val: any) => void;
  error?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  options?: Record<any, any>;
} & Record<string, any>;

const EntityFieldSelect: FC<IProps> = ({
  label,
  value,
  handler,
  error,
  isEditing,
  onClick,
  options,
}) => {
  const onChange = useCallback(
    (event) => {
      if (!handler) return;

      handler(event.target.value);
    },
    [value, handler]
  );

  return isEditing ? (
    <FormControl variant="outlined">
      <InputLabel htmlFor={label}>{label}</InputLabel>

      <Select
        variant="outlined"
        id={label}
        name={label}
        label={label}
        value={!value ? '' : value}
        onChange={onChange}
        error={!!error}
        inputProps={{ className: 'select' }}
      >
        <MenuItem value="">...</MenuItem>

        {options &&
          Object.keys(options).map((item) => (
            <MenuItem key={item} value={item}>
              {options[item]}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  ) : (
    <div onClick={onClick}>
      {(options && options[value]) || <div>&nbsp;</div>}
    </div>
  );
};

export { EntityFieldSelect };
