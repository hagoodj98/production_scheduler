import { cookies } from 'next/headers';

export const CheckAuth = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('session') ? true : false;
};
