import React from 'react';
import { WithStyles } from '@material-ui/core';
import styles from './styles';
import { IEntityProps } from '../../../types/entity';
declare type IProps = WithStyles<typeof styles> & {
    title: string;
    canCreate: boolean;
    url: string;
    filters: IEntityProps['filters'];
    setFilters: (filters: IEntityProps['filters']) => void;
    applyFilter: () => void;
};
declare const EntityHead: React.ComponentType<Pick<React.PropsWithChildren<IProps>, "title" | "children" | "url" | "applyFilter" | "filters" | "canCreate" | "setFilters"> & import("@material-ui/core").StyledComponentProps<"title" | "header">>;
export { EntityHead };
