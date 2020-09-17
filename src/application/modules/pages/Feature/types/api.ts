import { Feature } from '~/application/modules/pages/Feature';
import { FeatureAction } from '~/application/modules/pages/Feature/types/index';

export type IBaseEntityApiUrls = Partial<Record<FeatureAction, string>>;

export type FeatureGetListProps = {
  entity: Feature;
  url: string;
  filters: Record<string, string>;
  sortBy: string;
  sortDir: string;
  limit: number;
  offset: number;
};

export type FeatureGetReadProps = {
  entity: Feature;
  url: string;
  id: any;
};

export type FeatureGetListResult<Fields> = {
  data: Fields[];
  count: number;
  status?: number;
  error?: string;
};

export type FeatureGetReadResult<Fields> = {
  data: Fields;
  status?: number;
  error?: string;
};

export interface FeatureApiMethods<Fields> {
  list: (props: FeatureGetListProps) => Promise<FeatureGetListResult<Fields>>;
  read?: (props: FeatureGetReadProps) => Promise<FeatureGetReadResult<Fields>>;
}

export type FeatureApiHost = string;
