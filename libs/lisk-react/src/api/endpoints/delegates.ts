import { LiskAccount } from 'typings';

import { ApiMethods, ApiResponse } from '../typings';

export class Delegates {
  private methods: ApiMethods;
  readonly BASE_URI: string;

  constructor(methods: ApiMethods) {
    this.methods = methods;
    this.BASE_URI = `/api/delegates`;
  }

  async get(): Promise<ApiResponse<LiskAccount[]> | void> {
    const response = (await this.methods.get({
      uri: this.BASE_URI,
    })) as ApiResponse<LiskAccount[]>;
    if (response) return response;
  }
}
