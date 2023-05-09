import { NetworkEndpoint } from 'typings';
import { ApiResponse, RequestOptions } from 'typings/api';

import { Delegates } from './endpoints/delegates';

export const apiStates = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

export class Api {
  private _network: NetworkEndpoint;
  private readonly _delegates: Delegates;

  constructor(targetNetwork: NetworkEndpoint) {
    this._network = targetNetwork;

    const methods = {
      get: this.get,
      post: this.post,
    };

    this._delegates = new Delegates(methods);
  }

  async get<T>(options: RequestOptions): Promise<ApiResponse<T>> {
    const { uri } = options;

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const URL = `${this._network.nodeUrl}${uri}`;

    const res = await fetch(URL, {
      method: 'GET',
      headers,
    });

    if (res.ok) {
      const response = await res.json();
      return {
        data: response?.data as T,
      };
    }
    const error = await res.json();
    throw new Error(error?.message);
  }

  async post(options: RequestOptions) {
    const { uri, ...fetchOptions } = options;

    if (fetchOptions.body) {
      fetchOptions.body = JSON.stringify(fetchOptions.body);
    }

    const URL = `${this._network.nodeUrl}${uri}`;

    const res = await fetch(URL, {
      ...fetchOptions,
      method: 'POST',
      headers: {
        ...fetchOptions.headers,
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        state: apiStates.SUCCESS,
        data,
      };
    }
    const error = await res.json();
    throw new Error(error?.message);
  }

  public get delegates(): Delegates {
    return this._delegates;
  }
}
