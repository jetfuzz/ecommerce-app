import { useState } from 'react';

export function useConfirmDelete<T>(
  deleteFn: (item: T) => Promise<void>,
  onError: (err: unknown) => void,
) {
  const [pending, setPending] = useState<T | null>(null);

  function request(item: T) {
    setPending(item);
  }

  function cancel() {
    setPending(null);
  }

  async function confirm() {
    if (!pending) return;
    try {
      await deleteFn(pending);
    } catch (err) {
      onError(err);
    } finally {
      setPending(null);
    }
  }

  return { pending, request, cancel, confirm };
}
