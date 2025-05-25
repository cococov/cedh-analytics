/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2021-present CoCoCov
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  Original Repo: https://github.com/cococov/cedh-analytics
 *  https://www.cedh-analytics.com/
 */

import { forwardRef, ForwardedRef } from 'react';
import Link, { LinkProps } from 'next/link';
import { Button } from '@/components/vendor/materialUi';

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;
type NextLinkProps = Omit<ButtonProps, 'href'> & 
  Pick<LinkProps, 'href' | 'as' | 'prefetch' | 'locale'>;

function NextLink({ href, as, prefetch, locale, ...props }: NextLinkProps, ref: ForwardedRef<HTMLButtonElement>) {
  return (
    <Link href={href} as={as} prefetch={prefetch} locale={locale} passHref>
      <Button ref={ref} {...props} />
    </Link>
  );
};

export default forwardRef<HTMLButtonElement, NextLinkProps>(NextLink);
