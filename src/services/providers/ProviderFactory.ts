import {
  IDataProvider
} from './IDataProvider';

import {
  NepseDataProvider
} from './NepseDataProvider';

export class ProviderFactory {

  private static provider:
    IDataProvider | null = null;

  static getProvider():
    IDataProvider {

    if (!this.provider) {
      this.provider =
        new NepseDataProvider();
    }

    return this.provider;
  }

  static setProvider(
    provider: IDataProvider
  ) {
    this.provider =
      provider;
  }
}