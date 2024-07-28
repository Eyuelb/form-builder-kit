import React from "react";
import { FormBuilderContext } from "../context";
import { IFormBuilderProvider } from "../types";
import { FieldValues } from "react-hook-form";



const FormBuilderProvider: IFormBuilderProvider<FieldValues> = ({ children, elements }) => <FormBuilderContext.Provider value={{ elements }}>{children}</FormBuilderContext.Provider>;

export default FormBuilderProvider;
