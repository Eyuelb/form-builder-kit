/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect } from "react";
import { useGetField } from "./useFields";
import { useFormContext} from "react-hook-form";
import { useFieldConfiguration } from "./useFieldConfiguration";
import { getOption, matchArraysByKey } from "../utils";
import { useDeepMemo } from "./useDeepMemo";
import useWatchFields from "./useWatch";

const useFieldListener = () => {
  const field = useFieldConfiguration();
  const { setValue, getValues } = useFormContext();
  const onWatchFieldNames = field.onWatchFields?.fields ?? [];
  const onWatchFormatter = field.onWatchFields?.formatter;
  const onWatchFields = useGetField(onWatchFieldNames);
  const onWatchFieldsValue = useWatchFields(onWatchFieldNames);
  const memoOnWatch = useDeepMemo(
    () =>
      matchArraysByKey(onWatchFields, onWatchFieldsValue, "name").map(
        (field) => ({
          ...field,
          data: [],
        })
      ),
    [onWatchFields, onWatchFieldsValue]
  );

  const fn = {
    getSelectedValue: (
      data: any,
      value: any,
      by: "label" | "value" = "value"
    ) => getOption(data, value, by),
  };

  useEffect(() => {
    const valuesWithFormatter = onWatchFormatter && onWatchFormatter(memoOnWatch as any, fn);
    if (onWatchFormatter && valuesWithFormatter && valuesWithFormatter !== getValues(field.name)) {
      console.log(field.name, {valuesWithFormatter},"=",getValues(field.name));
       setValue(field.name, valuesWithFormatter);
    }

    console.log("onWatchFields", memoOnWatch);
    return () => {};
  }, [memoOnWatch]);

  return;
};

export default useFieldListener;
