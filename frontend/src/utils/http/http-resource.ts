import { AxiosInstance, AxiosResponse } from 'axios';

export default class HttpResource<T = any> {
  constructor(protected http: AxiosInstance, protected resource: string) {}

  list(): Promise<AxiosResponse<{ data: T[] }>> {
    return this.http.get<{ data: T[] }>(this.resource);
  }

  get(id: string): Promise<AxiosResponse<T>> {
    return this.http.get<T>(`${this.resource}/${id}`);
  }

  create(data: Omit<T, 'id'>): Promise<AxiosResponse<T>> {
    return this.http.post<T>(this.resource, data);
  }

  update(id: string, data: unknown): Promise<AxiosResponse<T>> {
    return this.http.put<T>(`${this.resource}/${id}`, data);
  }

  delete(id: string): Promise<AxiosResponse<T>> {
    return this.http.delete(`${this.resource}/${id}`);
  }
}
