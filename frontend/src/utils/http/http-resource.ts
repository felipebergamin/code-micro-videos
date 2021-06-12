import axios, { AxiosInstance, AxiosResponse } from 'axios';

export default class HttpResource<T = any> {
  constructor(protected http: AxiosInstance, protected resource: string) {}

  list(options?: {
    queryParams?: any;
  }): Promise<AxiosResponse<{ data: T[]; meta: { total: number } }>> {
    return this.http.get<{ data: T[]; meta: { total: number } }>(
      this.resource,
      {
        params: options?.queryParams || {},
      },
    );
  }

  listAll(): Promise<AxiosResponse<{ data: T[] }>> {
    return this.http.get<{ data: T[] }>(this.resource, {
      params: {
        all: '',
      },
    });
  }

  get(id: string): Promise<AxiosResponse<{ data: T }>> {
    return this.http.get<{ data: T }>(`${this.resource}/${id}`);
  }

  create(data: Omit<T, 'id'>): Promise<AxiosResponse<{ data: T }>> {
    return this.http.post<{ data: T }>(this.resource, data);
  }

  update(id: string, data: unknown): Promise<AxiosResponse<{ data: T }>> {
    return this.http.put<{ data: T }>(`${this.resource}/${id}`, data);
  }

  delete(id: string): Promise<AxiosResponse<T>> {
    return this.http.delete(`${this.resource}/${id}`);
  }

  // eslint-disable-next-line class-methods-use-this
  isCancelledRequest(error: Error): boolean {
    return axios.isCancel(error);
  }
}
