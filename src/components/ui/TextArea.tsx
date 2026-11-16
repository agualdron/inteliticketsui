import type { ComponentProps } from 'react';
import { Label, TextArea as AriaTextArea, TextField } from 'react-aria-components';

interface TextAreaProps extends Omit<ComponentProps<typeof AriaTextArea>, 'className'> {
  label: string;
  fieldClassName?: string;
}

/** Untitled UI React textarea primitive for the public heuristic demo. */
export function TextArea({ label, fieldClassName = '', ...props }: TextAreaProps) {
  return (
    <TextField className={`demo-field ${fieldClassName}`.trim()}>
      <Label>{label}</Label>
      <AriaTextArea {...props} />
    </TextField>
  );
}
