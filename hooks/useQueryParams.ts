'use client';

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
            if (is(Object, value_obj[key]) && has('v', value_obj[key])) return { ...acc, [key]: value_obj[key].v };
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
