"use client";

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
/* Own */
import AppContext from '@/contexts/appStore';

export default function TableRowWithLink({
  key,
  link,
  className,
  children
}: {
  key: string,
  link: string,
  className: string,
  children: React.ReactNode,
}) {
  const router = useRouter();
  const { toggleLoading } = useContext(AppContext);

  const handleClickTopRow = (link: string) => (_event: React.MouseEvent<HTMLTableRowElement, MouseEvent> | undefined) => {
    toggleLoading(true);
    router.push(link);
  };

  return (
    <tr key={key} className={className} onClick={handleClickTopRow(link)}>
      {children}
    </tr>
  );
};
