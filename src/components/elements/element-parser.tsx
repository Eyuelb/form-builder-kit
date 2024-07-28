import React from "react";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { IElementParser } from "../../types";
import { useFormBuilderElements } from "../../hooks/useFormBuilder";
import { isFunction } from "../../utils";

const ElementParser = ({ schema }: IElementParser<FieldValues>) => {
  const { props, ignoreController } = schema as any;

  const elements = useFormBuilderElements();
  const formContext = useFormContext(); // retrieve all hook methods
  const elementRender = elements?.find((a) => a.type === schema?.type)?.render;
  if (!elementRender) return <></>;
  if (ignoreController)
    return elementRender({
      formState: formContext.formState,
      schema: {
        ...schema,
        props:
          props && isFunction(props) ? props({ ...formContext, schema }) : props,
      },
    });

  return (
    <Controller
      name={`${schema?.key}` as const}
      control={formContext.control}
      rules={schema.rules}
      defaultValue={schema.defaultValue ?? ""}
      render={({ ...forwardedProps }) =>
        elementRender({
          ...forwardedProps,
          schema: {
            ...schema,
            props:
              props && isFunction(props)
                ? props({ ...forwardedProps, schema })
                : props,
          },
        })
      }
    />
  );
};

export default ElementParser;
