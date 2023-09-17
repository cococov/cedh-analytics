
"use client";

import { useRouter } from 'next/navigation';

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

  const handleClickTopRow = (link: string) => (_event: React.MouseEvent<HTMLTableRowElement, MouseEvent> | undefined) => {
    router.push(link);
  };

  return (
    <tr key={key} className={className} onClick={handleClickTopRow(link)}>
      {children}
    </tr>
  );
};
