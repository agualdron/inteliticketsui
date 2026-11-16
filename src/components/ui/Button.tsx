import type { ComponentProps, ReactNode } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { Link } from 'react-router';

type AriaButtonProps = ComponentProps<typeof AriaButton>;
type Variant = 'primary' | 'outline' | 'small' | 'light' | 'chip' | 'plain';

interface ButtonProps extends Omit<AriaButtonProps, 'className' | 'children'> {
  children: ReactNode;
  className?: string;
  to?: string;
  variant?: Variant;
  isDisabled?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: '',
  outline: 'button--outline',
  small: 'button--small',
  light: 'button--light',
  chip: 'button--chip',
  plain: 'button--plain',
};

/** Untitled UI React button primitive adapted to the app's local Tailwind tokens. */
export function Button({ children, className = '', to, variant = 'primary', isDisabled, ...props }: ButtonProps) {
  const classes = `button ${variantClass[variant]} ${className}`.trim();
  if (to) {
    return (
      <Link className={classes} to={isDisabled ? '#' : to} aria-disabled={isDisabled || undefined} tabIndex={isDisabled ? -1 : undefined}>
        {children}
      </Link>
    );
  }
  return <AriaButton {...props} className={classes} isDisabled={isDisabled}>{children}</AriaButton>;
}
