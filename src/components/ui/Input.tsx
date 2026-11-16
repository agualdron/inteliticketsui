import type { ComponentProps } from 'react';
import { Input as AriaInput, Label, TextField } from 'react-aria-components';

interface InputProps extends Omit<ComponentProps<typeof AriaInput>, 'className'> {
  label: string;
  error?: string;
  errorId?: string;
}

/** Untitled UI React input primitive with the project's shared label/error treatment. */
export function Input({ label, error, errorId, ...props }: InputProps) {
  return (
    <TextField className="field" isInvalid={Boolean(error)}>
      <Label>{label}</Label>
      <AriaInput {...props} />
      {error && <span className="field-error" id={errorId}>{error}</span>}
    </TextField>
  );
}
