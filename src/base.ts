import { ethers } from 'ethers';
import fetch from "isomorphic-unfetch";

type Config = {
  apiKey: string;
  baseUrl?: string;
};

export abstract class Base {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://api.soulbind.app/api";
  }

  public getSignatureMessage(address: string): Uint8Array {
    let messageHash = ethers.utils.solidityKeccak256(
      ["address"],
      [address]
    );

    return ethers.utils.arrayify(messageHash);
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      "soulbind-api-key": this.apiKey,
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
}
