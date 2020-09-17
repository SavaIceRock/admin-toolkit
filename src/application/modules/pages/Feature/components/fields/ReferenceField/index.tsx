import React from 'react';
import { SelectField } from '~/application/modules/pages/Feature/components/fields/SelectField';
import { computed, observable } from 'mobx';
import { FeatureField } from '~/application/modules/pages/Feature/components/fields/FeatureField';
import { Placeholder } from '~/application/modules/pages/Feature/components/common/Placeholder';
import { observer } from 'mobx-react';

export class ReferenceField<T extends Record<string, any>> extends SelectField<
  T
> {
  @computed
  get isLoading() {
    return this.feature?.data.references[this.name].isLoadingAll || false;
  }

  @computed
  get listVariants() {
    return this.feature?.data.references[this.name].all || {};
  }

  @observable
  List: FeatureField['List'] = observer(({ value }) => {
    return this.isLoading ? (
      <Placeholder />
    ) : (
      <div>{this.formatValue(value)}</div>
    );
  });
}
