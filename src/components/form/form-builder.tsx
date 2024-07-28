import React, { useMemo } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { IFormBuilder } from "../../types";
import { isFunction } from "../../utils";
import ElementParser from "../elements/element-parser";

const FormBuilder = <TFormValues extends FieldValues>({
  schema,
  onSubmit,
  children,
}: IFormBuilder<TFormValues>) => {
  const form = useForm<TFormValues>();
  const methods = useMemo(() => form, [form]);
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={
          onSubmit && isFunction(onSubmit)
            ? methods.handleSubmit(onSubmit)
            : undefined
        }
      >
        {schema?.map((schema: any, index: any) => (
          <ElementParser key={index} schema={schema} />
        ))}
        {children}
      </form>
    </FormProvider>
  );
};

export default FormBuilder;
