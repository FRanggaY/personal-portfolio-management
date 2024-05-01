import { useRouter, useSearchParams } from 'next/navigation';


export const handleSort = (router: ReturnType<typeof useRouter>, columnName: string, sortBy: string | null, sortOrder: string, searchParams: ReturnType<typeof useSearchParams>) => {
  let newOrder: string;
  if (sortBy === columnName) {
    newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    newOrder = 'asc';
  }

  const params = new URLSearchParams(searchParams);
  params.set('sort_by', columnName);
  params.set('sort_order', newOrder);
  const updatedSearch = `?${params.toString()}`;
  const newPath = `${window.location.pathname}${updatedSearch}`;
  router.push(newPath);
};
