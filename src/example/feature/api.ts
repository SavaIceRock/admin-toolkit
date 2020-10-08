import { IFields } from '~/example/feature/index';
import { generateBaseData } from '~/example/feature/mock';
import {
  FeatureApiMethodCreate,
  FeatureApiMethodGet,
  FeatureApiMethodList,
  FeatureApiMethodUpdate,
} from '~/application/modules/pages/Feature/types';
import { FeatureReferenceFetchAll } from '~/application/modules/pages/Feature/types/reference';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFeatureList: FeatureApiMethodList<IFields> = async ({
  url,
  ...props
}) => {
  console.log(`LIST ${url}`, { url, ...props });

  return delay(500).then(() => ({
    data: generateBaseData(props.limit),
    count: 100,
    status: 200,
    error: '',
  }));
};

export const getFeature: FeatureApiMethodGet<IFields> = async ({
  url,
  id,
  ...props
}) => {
  const items = parseInt(id, 10) || 1;
  const href = new URL(id, url).href;

  console.log(`READ ${href}`, { url, id, ...props });

  return delay(500).then(() => ({
    data: generateBaseData(items + 1)[items],
    status: 200,
    error: '',
  }));
};

export const createFeature: FeatureApiMethodCreate<IFields> = async ({
  url,
  ...props
}) => {
  console.log(`CREATE ${url}`, { url, ...props });

  return delay(500).then(() => ({
    data: generateBaseData(1)[0],
    status: 200,
    error: '',
  }));
};

export const updateFeature: FeatureApiMethodUpdate<IFields> = async ({
  url,
  id,
  ...props
}) => {
  console.log(`UPDATE ${url}`, { url, ...props });

  return delay(500).then(() => ({
    data: generateBaseData(id + 1)[id],
    status: 200,
    error: '',
  }));
};

export const getRolesAll: FeatureReferenceFetchAll = async (props) => {
  await delay(1000);

  console.log(`REFERENCE ${props.url}`, props);

  return {
    10: 'User',
    20: 'Manager',
    30: 'Admin',
  };
};
