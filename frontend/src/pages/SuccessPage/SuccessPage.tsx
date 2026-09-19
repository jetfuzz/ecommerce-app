import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

type PageStatus = 'loading' | 'success' | 'error';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<PageStatus>('loading');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }
    setStatus('success');
  }, [sessionId]);

  if (status === 'loading') return <p>Confirming your order...</p>;
  if (status === 'error') return <p>Something went wrong.</p>;

  return (
    <div>
      <CheckCircle2 size={64} color="#22c55e" strokeWidth={1.5} />
      <h1>Thank you for your order!</h1>
      <p>Your payment was successful.</p>
    </div>
  );
}
