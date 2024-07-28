// src/main.tsx
import React, { forwardRef } from "react";
import ReactDOM from "react-dom/client";
import FormBuilderProvider from "./provider/form-builder-provider";
import FormBuilder from "./components/form/form-builder";
import { ElementFactoryPayload, IFormElement, ISchemaProps } from "./types";

const BasicInput = forwardRef(
  ({ schema, field }: ElementFactoryPayload<any, "input">, ref: any) => {
    return (
      <div>
        <label htmlFor={schema.key}>{schema.label}</label>
        <input
          ref={ref}
          {...schema.props}
          {...field}
          onChange={(e) =>
            field?.onChange({
              target: {
                value: e.currentTarget.value,
              },
            })
          }
        />{" "}
      </div>
    );
  }
);
const Button = (props: ElementFactoryPayload<any, "button">) => {
  return <button {...props.schema.props}>{props.schema.props.name}</button>;
};
export const schema: ISchemaProps<any>[] = [
  {
    key: "firstName",
    type: "BasicInput",
    defaultValue: "john",
    label: "First Name",
    props: {},
  },
  {
    key: "lastName",
    type: "BasicInput",
    label: "Last Name",
    props: {},
  },
  {
    key: "submit",
    type: "Button",
    ignoreController: true,
    props: ({ formState: { isDirty } }) => ({
      type: "submit",
      name: isDirty ? "Save" : "Submit",
    }),
  },
];
export const elements: IFormElement<any>[] = [
  {
    type: "BasicInput",
    render: (props) => <BasicInput {...props} />,
  },
  {
    type: "Button",
    render: (props) => <Button {...props} />,
  },
];
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <FormBuilderProvider elements={elements}>
      <FormBuilder schema={schema} onSubmit={console.log} />
    </FormBuilderProvider>
  </React.StrictMode>
);
