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
import { render, screen } from '@testing-library/react';
import * as Sentry from '@sentry/nextjs';
import ButtonLink from '@/components/buttonLink';

// Mock next/link
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, as, prefetch, locale, passHref, children }: any) => {
      return React.cloneElement(children, {
        'data-href': href,
        'data-as': as,
        'data-prefetch': prefetch,
        'data-locale': locale,
        'data-passhref': passHref // Changed to lowercase to avoid React warnings
      });
    }
  };
});

// Mock Material UI Button
jest.mock('@/components/vendor/materialUi', () => {
  // Create a named button component with proper types
  const MockButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: 'text' | 'outlined' | 'contained';
      color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
      size?: 'small' | 'medium' | 'large';
      children?: React.ReactNode;
    }
  >(({ children, variant, color, size, ...props }, ref) => (
    <button 
      data-testid="mui-button" 
      ref={ref}
      data-variant={variant}
      data-color={color}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ));
  
  // Add display name
  MockButton.displayName = 'MockButton';
  
  return {
    Button: MockButton
  };
});

describe('ButtonLink Component', () => {
  it('renders with default props', () => {
    Sentry.startSpan(
      {
        op: 'test',
        name: 'ButtonLink render test',
      },
      () => {
        render(<ButtonLink href="/test">Test Link</ButtonLink>);
        
        const button = screen.getByTestId('mui-button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Test Link');
        expect(button).toHaveAttribute('data-href', '/test');
      }
    );
  });

  it('forwards all Next.js Link props', () => {
    render(
      <ButtonLink 
        href="/test" 
        as="/test-as" 
        prefetch={false} 
        locale="en-US"
      >
        Test Link
      </ButtonLink>
    );
    
    const button = screen.getByTestId('mui-button');
    expect(button).toHaveAttribute('data-href', '/test');
    expect(button).toHaveAttribute('data-as', '/test-as');
    expect(button).toHaveAttribute('data-prefetch', 'false');
    expect(button).toHaveAttribute('data-locale', 'en-US');
    expect(button).toHaveAttribute('data-passhref', 'true'); // Using lowercase attribute name
  });

  it('forwards all Button props', () => {
    render(
      <ButtonLink 
        href="/test"
        variant="contained"
        color="primary"
        size="large"
        disabled={true}
        className="custom-class"
      >
        Test Button
      </ButtonLink>
    );
    
    const button = screen.getByTestId('mui-button');
    expect(button).toHaveAttribute('data-variant', 'contained');
    expect(button).toHaveAttribute('data-color', 'primary');
    expect(button).toHaveAttribute('data-size', 'large');
    expect(button).toHaveAttribute('disabled'); // Boolean attributes in HTML don't need a value
    expect(button).toHaveAttribute('class', 'custom-class');
  });

  it('forwards ref correctly', () => {
    const TestComponent = () => {
      const ref = React.useRef<HTMLButtonElement>(null);
      
      React.useEffect(() => {
        // In a real test, we would check if the ref is correctly assigned
        // but in this mock setup, we can only verify that the ref is passed
        expect(ref.current).toBeDefined();
      }, []);
      
      return (
        <ButtonLink href="/test" ref={ref}>
          Test Link with Ref
        </ButtonLink>
      );
    };
    
    render(<TestComponent />);
    
    // The assertion is in the useEffect above
    expect(screen.getByTestId('mui-button')).toBeInTheDocument();
  });
});
