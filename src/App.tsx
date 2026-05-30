import AppRouter from './router';
import { QueryProvider } from './lib/query-provider';

export default function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}
