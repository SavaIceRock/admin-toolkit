import { FeatureField } from '~/application/modules/pages/Feature/fields/FeatureField';
import { computed, observable } from 'mobx';
import React from 'react';
import { SelectFilter } from '~/application/modules/pages/Feature/components/filters/SelectFilter';
import { observer } from 'mobx-react';
import { SelectInput } from '~/application/modules/pages/Feature/components/inputs/SelectInput';

export type SelectFieldOptions<T, V extends string | number> = FeatureField<
  T,
  V
>['options'] & {
  options?: Record<V, any>;
  autocomplete?: boolean;
};

export class SelectField<
  T extends Record<string, any> = Record<string, any>,
  V extends string | number = string
> extends FeatureField<T, V> {
  constructor(
    name: FeatureField['name'],
    { options, autocomplete, ...props }: SelectFieldOptions<T, V>
  ) {
    super(name, props);

    if (options) this.variants = options;
    if (autocomplete) this.autocomplete = true;
  }

  @observable variants: Record<any, any> = {};
  @observable autocomplete = false;

  @computed
  get listVariants() {
    return this.variants;
  }

  @computed
  get filterVariants() {
    return this.listVariants;
  }

  formatValue(val: any): any {
    return Object.prototype.hasOwnProperty.call(this.listVariants, val)
      ? this.listVariants[val]
      : val;
  }

  asString(val: string) {
    return this.formatValue(val);
  }

  @computed
  get List() {
    return ({ value }: { value: any }) => <div>{this.listVariants[value]}</div>;
  }

  @computed
  get Update() {
    return (
      <SelectInput
        label={this.label}
        onChange={this.onChange}
        variants={this.filterVariants}
        value={this.editValue}
        error={this.editError}
        isLoading={this.feature?.data.isLoading}
        autocomplete={
          Object.keys(this.variants).length > 10 || this.autocomplete
        }
      />
    );
  }

  @observable
  Filter: FeatureField['Filter'] = observer(({ inline }) => (
    <SelectFilter
      label={this.label}
      name={this.name}
      value={this.filterValue}
      onChange={this.onFilterChange}
      onReset={this.onFilterReset}
      variants={this.filterVariants}
      autocomplete={Object.keys(this.variants).length > 10 || this.autocomplete}
      inline={inline}
    />
  ));
}