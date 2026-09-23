import { isAxiosError } from 'axios';

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    if (data?.message) return data.message;
    if (data?.errors) {
      return Object.values(data.errors).flat().join(' ');
    }
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}
