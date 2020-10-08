import { action, computed, toJS } from 'mobx';
import {
  FeatureApiHost,
  FeatureApiMethods,
  FeatureApiReferences,
  FeatureApiUrls,
  FeatureGetListProps,
  FeatureGetListResult,
  FeatureGetReadProps,
  FeatureGetReadResult,
  FeaturePostCreateProps,
  FeaturePostCreateResult,
  FeaturePostUpdateProps,
  FeaturePostUpdateResult,
} from '~/application/modules/pages/Feature/types/api';
import { UNAUTHORIZED } from '~/application';
import { Feature } from '~/application/modules/pages/Feature';
import { has, keys } from 'ramda';
import { getReferenceAll } from '~/application/modules/pages/Feature/items/FeatureApi/references';
import { FeatureData } from '~/application/modules/pages/Feature/items/FeatureData';
import { FeatureMode } from '~/application/modules/pages/Feature/types';

export class FeatureApi<
  Fields extends Record<string, any> = Record<string, any>
> {
  constructor(private feature: Feature<Fields>) {}

  @computed
  get methods(): FeatureApiMethods<Fields> | undefined {
    return this.feature.options?.api?.methods;
  }

  @computed
  get host(): FeatureApiHost | undefined {
    return this.feature.options?.api?.host;
  }

  @computed
  get urls(): FeatureApiUrls | undefined {
    return this.feature.options?.api?.urls;
  }

  @computed
  get data(): FeatureData {
    return this.feature.data;
  }

  @computed
  get references(): FeatureApiReferences<Fields> | undefined {
    return this.feature.options.api?.references;
  }

  @computed
  get withToken() {
    if (!this.feature?.parent?.auth?.withToken) {
      throw new Error('WithToken not attached to api');
    }

    return this.feature?.parent.auth.withToken;
  }

  @action
  useFeature = (feature: Feature<Fields>) => {
    this.feature = feature;
  };

  @computed
  get availableFeatures(): Record<FeatureMode, boolean> {
    return Object.values(FeatureMode).reduce(
      (acc, mode) => ({
        ...acc,
        [mode]: !!(
          has(mode, this.methods) &&
          this.host &&
          has(mode, this.urls)
        ),
      }),
      {} as Record<FeatureMode, boolean>
    );
  }

  getList = async (
    feature: Feature<Fields>
  ): Promise<FeatureGetListResult<Fields>> => {
    if (!this.availableFeatures.list) {
      throw new Error('Specify feature api host, methods and urls first.');
    }

    const { sortBy, sortDir, page, rows, valuesForList } = feature.filters;

    const url = new URL(this.urls!!.list!!, this.host).href;

    const result: FeatureGetListResult<Fields> = await this.withToken(
      this.methods!!.list!!,
      {
        feature,
        url,
        filters: toJS(valuesForList),
        sortBy,
        sortDir,
        limit: rows,
        offset: page * rows,
      } as FeatureGetListProps
    );

    if (result.status === 401) {
      throw new Error(UNAUTHORIZED);
    }

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  };

  getRead = async (id: any): Promise<FeatureGetReadResult<Fields>> => {
    if (!this.availableFeatures.read) {
      throw new Error('Specify feature api host, methods and urls first.');
    }
    const feature = this.feature;
    const url = new URL(this.urls!!.read!!, this.host).href;

    const result: FeatureGetReadResult<Fields> = await this.withToken(
      this.methods!!.read!!,
      { url, feature, id } as FeatureGetReadProps
    );

    if (result.status === 401) {
      throw new Error(UNAUTHORIZED);
    }

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  };

  postCreate = async (
    data: FeatureData['editor']
  ): Promise<FeaturePostCreateResult<Fields>> => {
    if (!this.availableFeatures.create) {
      throw new Error('Specify feature api host, methods and urls first.');
    }

    const feature = this.feature;
    const url = new URL(this.urls!!.create!!, this.host).href;

    const result: FeaturePostCreateResult<Fields> = await this.withToken(
      this.methods!!.create!!,
      { url, feature, data } as FeaturePostCreateProps<Fields>
    );

    if (result.status === 401) {
      throw new Error(UNAUTHORIZED);
    }

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  };

  postUpdate = async (
    id: any,
    data: FeatureData['editor']
  ): Promise<FeaturePostUpdateResult<Fields>> => {
    if (!this.availableFeatures.update) {
      throw new Error('Specify feature api host, methods and urls first.');
    }
    const feature = this.feature;
    const url = new URL(this.urls!!.create!!, this.host).href;

    const result: FeaturePostUpdateResult<Fields> = await this.withToken(
      this.methods!!.update!!,
      { url, feature, data, id } as FeaturePostUpdateProps<Fields>
    );

    if (result.status === 401) {
      throw new Error(UNAUTHORIZED);
    }

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  };

  @action
  async getReferencesAll<Fields>() {
    if (!keys(this.references).length || !this.feature) return;

    const refs = keys(this.references);

    await Promise.all(
      refs.map(async (ref) => {
        this.data.references[ref].isLoadingAll = true;
        this.data.references[ref].all = await this.withToken(getReferenceAll, {
          feature: this.feature,
          name: ref,
          host: this.host,
        });
        this.feature.data.references[ref].isLoadingAll = false;
      })
    );
  }
}
