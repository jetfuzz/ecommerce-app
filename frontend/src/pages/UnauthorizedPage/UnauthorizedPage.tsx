import { Link } from 'react-router';

export default function UnauthorizedPage() {
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}
