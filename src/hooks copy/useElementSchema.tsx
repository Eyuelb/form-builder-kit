import { useContext } from 'react';
import { FormElementContext } from '../context';
import { ISchemaProps } from '../types';
import { FieldValues } from 'react-hook-form';


export const useElementSchema =<TFormValues extends FieldValues,> () => {
  const context = useContext(FormElementContext) as any;
  if (!context) {
    throw new Error(`useFields must be used within a FieldsProvider`);
  }
  return context.schema as  ISchemaProps<TFormValues>;
};
