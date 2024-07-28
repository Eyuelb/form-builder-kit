import { extend } from "lodash";
import { PropsWithChildren } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldName,
  FieldPathValue,
  FieldValues,
  RegisterOptions,
  SubmitHandler,
  UnpackNestedValue,
  UseFormReturn,
  UseFormStateReturn,
} from "react-hook-form";

export type IFormElement<TFieldValues extends FieldValues> = {
  type: string;
  render: ({
    field,
    fieldState,
    formState,
    schema,
  }: {
    field?: ControllerRenderProps<FieldValues, `${FieldName<TFieldValues>}`>;
    fieldState?: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
    schema: IFormElementSchema<TFieldValues>;
  }) => React.ReactElement;
};

interface IFormElementSchema<
  TFieldValues extends FieldValues,
  ElementType extends React.ElementType = any,
  PropsToOmit extends string = never
> extends Omit<ISchemaProps<TFieldValues>, "props"> {
  props: DefaultElementProps<ElementType, PropsToOmit>;
}
export type IFormBuilderProvider<TFormValues extends FieldValues> = (args: {
  children: React.ReactElement;
  elements: IFormElement<TFormValues>[];
}) => React.ReactElement;
export type IFormElementProvider<TFormValues extends FieldValues> = (args: {
  children: React.ReactElement;
  schema: ISchemaProps<TFormValues>;
}) => React.ReactElement;

export type IFormBuilder<TFormValues extends FieldValues> = {
  onSubmit?: SubmitHandler<TFormValues>;
  children?: React.ReactNode;
  schema: ISchemaProps<TFormValues>[];
};

export interface IElementParser<TFormValues extends FieldValues> {
  schema: ISchemaProps<TFormValues>;
}

export interface ISchemaProps<
  TFormValues extends Record<string, any>,
  ElementType extends React.ElementType = any,
  PropsToOmit extends string = never
> {
  key: FieldName<TFormValues>;
  type: string; // Define the allowed field types
  label?: string;
  placeholder?: string;
  description?: string;
  defaultValue?: UnpackNestedValue<FieldPathValue<TFormValues, any>>;
  disabled?: boolean;
  hidden?: boolean;
  data?: FieldOption[];
  dataSource?: DataSourceType;
  rules?: Exclude<
    RegisterOptions,
    "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  ignoreController?: boolean;
  onDidMount?: (args: UseFormReturn) => void;
  onDidUnMount?: (args: UseFormReturn) => void;
  props:
    | DefaultElementProps<ElementType, PropsToOmit>
    | ((args: {
        field: ControllerRenderProps<FieldValues, `${FieldName<TFormValues>}`>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFormValues>;
        schema: ISchemaProps<TFormValues, ElementType, PropsToOmit>;
      }) => DefaultElementProps<ElementType, PropsToOmit>);
}
export type DefaultElementProps<
  ElementType extends React.ElementType,
  PropsToOmit extends string = never
> = Omit<React.ComponentPropsWithoutRef<ElementType>, "style" | PropsToOmit>;
export type ElementFactoryPayload<
  TFormValues extends Record<string, any>,
  ElementType extends React.ElementType = any,
  PropsToOmit extends string = never
> = {
  field?: ControllerRenderProps<FieldValues, `${FieldName<TFormValues>}`>;
  fieldState?: ControllerFieldState;
  formState: UseFormStateReturn<TFormValues>;
  schema: ISchemaProps<TFormValues, ElementType, PropsToOmit>;
};

//ISchemaProps<TFormValues, ElementType, PropsToOmit>["props"]
export interface FieldOption {
  label: string;
  value: any;
}

export type MethodType = "GET" | "POST" | "PUT" | "DELETE";

export type DataSourceType = {
  url?: string;
  method?: MethodType;
  key?: string;
  valueKey?: string;
  labelKey?: string;
};
