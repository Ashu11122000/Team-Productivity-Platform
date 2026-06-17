'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';

import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '@/lib/utils';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext =
  React.createContext<FormFieldContextValue | null>(
    null,
  );

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider
      value={{
        name: props.name,
      }}
    >
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext =
  React.createContext<FormItemContextValue | null>(
    null,
  );

function useFormField() {
  const fieldContext =
    React.useContext(FormFieldContext);

  const itemContext =
    React.useContext(FormItemContext);

  const { getFieldState, formState } =
    useFormContext();

  if (!fieldContext) {
    throw new Error(
      'useFormField must be used within <FormField>',
    );
  }

  if (!itemContext) {
    throw new Error(
      'useFormField must be used within <FormItem>',
    );
  }

  const fieldState = getFieldState(
    fieldContext.name,
    formState,
  );

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider
      value={{ id }}
    >
      <div
        data-slot="form-item"
        className={cn(
          'space-y-2',
          className,
        )}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
>) {
  const { error, formItemId } =
    useFormField();

  return (
    <LabelPrimitive.Root
      htmlFor={formItemId}
      data-slot="form-label"
      className={cn(
        'text-sm font-medium leading-none',
        error && 'text-destructive',
        className,
      )}
      {...props}
    />
  );
}

function FormControl({
  ...props
}: React.ComponentPropsWithoutRef<
  typeof Slot
>) {
  const {
    error,
    formItemId,
    formDescriptionId,
    formMessageId,
  } = useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        error
          ? `${formDescriptionId} ${formMessageId}`
          : formDescriptionId
      }
      aria-invalid={!!error}
      data-slot="form-control"
      {...props}
    />
  );
}

function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } =
    useFormField();

  return (
    <p
      id={formDescriptionId}
      data-slot="form-description"
      className={cn(
        'text-sm text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

function FormMessage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { error, formMessageId } =
    useFormField();

  const body = error
    ? String(error?.message ?? '')
    : children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={formMessageId}
      role="alert"
      data-slot="form-message"
      className={cn(
        'text-sm font-medium text-destructive',
        className,
      )}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
};