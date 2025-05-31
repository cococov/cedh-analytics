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

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/nextjs';

/* Mock the cn utility function */
jest.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}));

/* Mock the CSS module */
jest.mock('@/styles/Shadcn.module.css', () => ({
  shadcnComponent: 'shadcn-component-class',
}));

describe('Button component', () => {
  it('renders a button with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('shadcn-component-class');
    expect(button).toHaveClass('bg-primary');
  });

  it('renders a button with custom variant and size', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>
    );

    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('h-11');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole('button', { name: /custom button/i });
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref to button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('renders as a child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('shadcn-component-class');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();

    Sentry.startSpan(
      {
        op: 'test',
        name: 'Button click test',
      },
      () => {
        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole('button', { name: /click me/i });
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    );
  });

  it('applies disabled state correctly', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });
});
