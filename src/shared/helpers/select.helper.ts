/**
 * get values by array select data label / value
 * @param selectedValues: { label: string: value: any }[] - Data to get values
 */
export const getValuesByMultiSelect = (
  selectedValues: { label: string, value: string }[],
) => selectedValues.map((level: any) => level.value);
