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
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import * as Sentry from '@sentry/nextjs';

/* Mock the cn utility function */
jest.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}));

/* Mock the CSS module */
jest.mock('@/styles/Shadcn.module.css', () => ({
  shadcnComponent: 'shadcn-component-class',
}));

/* Mock Portal implementation since JSDOM doesn't fully support it */
jest.mock('@radix-ui/react-popover', () => {
  const React = require('react');
  
  // Simple component implementations without complex typing
  const Root = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-root">{children}</div>
  );
  
  // Use forwardRef without generics to avoid TypeScript errors in Jest mocks
  const Trigger = React.forwardRef((props: any, ref: any) => (
    <button 
      data-testid="popover-trigger" 
      ref={ref} 
      {...props}
    >
      {props.children}
    </button>
  ));
  Trigger.displayName = 'PopoverTrigger';
  
  const Content = React.forwardRef((props: any, ref: any) => {
    // Extract sideOffset and align props to avoid passing them directly to the DOM
    const { sideOffset, align, children, ...restProps } = props;
    
    return (
      <div 
        data-testid="popover-content" 
        ref={ref} 
        {...restProps}
        data-side-offset={sideOffset}
        data-align={align}
      >
        {children}
      </div>
    );
  });
  Content.displayName = 'PopoverContent';
  
  const Portal = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-portal">{children}</div>
  );

  return {
    Root,
    Trigger,
    Content,
    Portal,
  };
});

describe('Popover component', () => {
  it('renders popover components correctly', () => {
    Sentry.startSpan(
      {
        op: 'test',
        name: 'Popover render test',
      },
      () => {
        render(
          <Popover>
            <PopoverTrigger>Open Popover</PopoverTrigger>
            <PopoverContent>Popover Content</PopoverContent>
          </Popover>
        );

        // Check that the popover components are rendered
        expect(screen.getByTestId('popover-root')).toBeInTheDocument();
        expect(screen.getByTestId('popover-trigger')).toBeInTheDocument();
        expect(screen.getByTestId('popover-portal')).toBeInTheDocument();
        expect(screen.getByTestId('popover-content')).toBeInTheDocument();
        
        // Check content
        expect(screen.getByText('Open Popover')).toBeInTheDocument();
        expect(screen.getByText('Popover Content')).toBeInTheDocument();
      }
    );
  });

  it('applies custom className to PopoverContent', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent className="custom-popover-class">
          Popover Content
        </PopoverContent>
      </Popover>
    );

    const popoverContent = screen.getByTestId('popover-content');
    expect(popoverContent).toHaveClass('shadcn-component-class');
    expect(popoverContent).toHaveClass('custom-popover-class');
  });

  it('applies custom align and sideOffset props', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent align="start" sideOffset={10}>
          Popover Content
        </PopoverContent>
      </Popover>
    );

    const popoverContent = screen.getByTestId('popover-content');
    expect(popoverContent).toHaveAttribute('data-align', 'start');
    expect(popoverContent).toHaveAttribute('data-side-offset', '10');
  });

  it('forwards ref to PopoverContent', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent ref={ref}>
          Popover Content
        </PopoverContent>
      </Popover>
    );

    expect(ref.current).not.toBeNull();
  });
});
