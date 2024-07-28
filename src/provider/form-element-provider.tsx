import React from "react";
import { IFormElementProvider } from "../types";
import { FieldValues } from "react-hook-form";
import { FormElementContext } from "../context";

const FormElementProvider: IFormElementProvider<FieldValues> = ({
  children,
  schema,
}) => (
  <FormElementContext.Provider value={{ schema }}>
    {children}
  </FormElementContext.Provider>
);

export default FormElementProvider;
