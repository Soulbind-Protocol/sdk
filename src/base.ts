import { ConnectExtension } from '@magic-ext/connect';
import fetch from 'isomorphic-unfetch';
import { Magic } from 'magic-sdk';
import { RequestMethod } from './requests/types';

type Config = {
  apiKey: string;
  baseUrl?: string;
};

export abstract class Base {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.soulbind.app/api';
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'soulbind-api-key': this.apiKey,
    };
    const config = {
      ...options,
      headers,
    };

    return fetch(url, config).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    });
  }

  protected async startupMagic() {
    const url = `${this.baseUrl}/v1/contract/network`;

    const options = {
      method: RequestMethod.get
    }
    const headers = {
      'Content-Type': 'application/json',
      'soulbind-api-key': this.apiKey,
    };
    const config = {
      ...options,
      headers,
    };

    return fetch(url, config).then(async (response) => {
      if (response.ok) {
        const apiResponse = await response.json();

        return new Magic(apiResponse.success.magicKey, {
          extensions: [new ConnectExtension()],
          network: apiResponse.success.network,
        });
      }
      throw new Error(response.statusText);
    });
  }
}
