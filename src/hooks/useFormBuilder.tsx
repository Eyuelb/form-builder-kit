import { useContext } from 'react';
import { FormBuilderContext, FormElementContext } from '../context';
import { IFormElement, ISchemaProps } from '../types';
import { FieldValues } from 'react-hook-form';


export const useFormBuilder =<TFormValues extends FieldValues,> () => {
  const context = useContext(FormBuilderContext) as any;
  if (!context) {
    throw new Error(`useFormBuilder must be used within a FormBuilderProvider`);
  }
  return context as  ISchemaProps<TFormValues>;
};
export const useFormBuilderElements =<TFormValues extends FieldValues,> () => {
  const context = useContext(FormBuilderContext) as any;
  if (!context) {
    throw new Error(`useFormBuilderElements must be used within a FormBuilderProvider`);
  }
  return context.elements as IFormElement<TFormValues>[];
};