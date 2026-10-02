// A simple fetcher function for use with SWR or other data fetching libraries.
import { OrderLogData, OrderProps } from '../app/components/types';

const fetcher = async (url: string): Promise<{ jobs: OrderProps[] } | { logs: OrderLogData[] }> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${url} failed: ${res.status}`);
  return await res.json();
};

export default fetcher;
