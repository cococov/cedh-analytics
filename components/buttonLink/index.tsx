import { forwardRef, Ref } from 'react';
import Link, { LinkProps } from 'next/link';
import { Button } from '../vendor/materialUi';

type LinkRef = HTMLAnchorElement | HTMLButtonElement
type NextLinkProps = (Omit<any, 'href'> &
  Pick<LinkProps, 'href' | 'as' | 'prefetch' | 'locale'>) | any;

function NextLink({ href, as, prefetch, locale, ...props }: LinkProps, ref: Ref<LinkRef>) {
  return (
    <Link href={href} as={as} prefetch={prefetch} locale={locale} passHref>
      <Button ref={ref as any} {...props as any} />
    </Link>
  );
};

export default forwardRef<LinkRef, NextLinkProps>(NextLink);
