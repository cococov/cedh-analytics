/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2023-present CoCoCov
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

"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// Vendor
import { is, has, isEmpty, isNil } from 'ramda';
import { stringify as qsStringify } from 'qs';

export default function useQueryParams<T>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams?.toString());

  function setQueryParams(params: Partial<T>) {
    Object.entries(params)
      .forEach(([key, value]) => {
        if (isNil(value) || isEmpty(value)) {
          urlSearchParams.delete(key);
        } else if (is(Array, value)) {
          if (isEmpty(value)) return urlSearchParams.delete(key);
          urlSearchParams.set(key, String(value));
        } else if (is(Object, value)) {
          const value_obj = value as Record<string, string | unknown[] | Record<string, unknown>>;
          const filteredValue = Object.keys(value).reduce((acc, key) => {
            if (isNil(value_obj[key]) || isEmpty(value_obj[key])) return acc;
            // @ts-ignore
            if (is(Object, value_obj[key]) && has('v', value_obj[key]) && (isNil(value_obj[key].v) || isEmpty(value_obj[key].v))) return acc;
            // @ts-ignore
            if (is(Object, value_obj[key]) && has('v', value_obj[key]) && has('o', value_obj[key])) return { ...acc, [`${key}v`]: value_obj[key].v, [`${key}o`]: value_obj[key].o };
            return { ...acc, [key]: value_obj[key] };
          }, {} as Record<string, string | unknown[] | Record<string, unknown>>);
          if (isEmpty(filteredValue)) return urlSearchParams.delete(key);
          urlSearchParams.set(key, qsStringify(filteredValue, { encode: false }));
        } else {
          urlSearchParams.set(key, String(value));
        }
      });

    const search = urlSearchParams.toString();
    const query = search ? `?${search}` : '';

    router.replace(`${pathname}${query}`);
  };

  return { queryParams: searchParams, setQueryParams };
};
