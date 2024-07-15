import { useDeepMemo } from "./useDeepMemo";
import { useFieldConfiguration } from "./useFieldConfiguration";

export const useSelect = () => {
  const field = useFieldConfiguration();

  const { data: manualData, name, dataSource } = field;
  const memoData = useDeepMemo(
    () => ({
      data: [],
    }),
    []
  );

  return {
    data: manualData ?? [],
    isLoading: false,
  };

};
