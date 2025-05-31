/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2025-present CoCoCov
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
import * as Sentry from '@sentry/nextjs';

declare module '@sentry/nextjs' {
  export interface SpanAttributes {
    [key: string]: string | number | boolean | undefined;
  }

  export interface Span {
    setAttribute(key: string, value: string | number | boolean): void;
  }

  export function startSpan<T>(
    spanContext: {
      name: string;
      op: string;
      [key: string]: any;
    },
    callback: (span: Span) => T
  ): T;

  export function withServerActionInstrumentation<T>(
    options: {
      name: string;
      op: string;
      [key: string]: any;
    },
    callback: () => T
  ): T;

  export interface ErrorContext {
    contexts?: {
      [key: string]: any;
    };
    tags?: {
      [key: string]: string;
    };
    extra?: {
      [key: string]: any;
    };
  }

  export function captureException(error: Error, context?: ErrorContext): string;
}
