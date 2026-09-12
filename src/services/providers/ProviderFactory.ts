import { IDataProvider } from './IDataProvider';
import { NepseDataProvider } from './NepseDataProvider';

export class ProviderFactory {
  private static instance: IDataProvider;

  public static getProvider(): IDataProvider {
    if (!ProviderFactory.instance) {
      // Default to NepseDataProvider with live HamroShare & NEPSE official scraping
      ProviderFactory.instance = new NepseDataProvider();
    }
    return ProviderFactory.instance;
  }

  public static setProvider(provider: IDataProvider): void {
    ProviderFactory.instance = provider;
  }
}
