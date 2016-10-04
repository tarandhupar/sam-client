export type OptionsType = Array<{
  value: string | number, // the model value
  label: string, // the visible text for the input or option
  name: string, // the machine readable description of the input
  disabled?: boolean // if true, the option is greyed out and not clickable
}>;

export type WrapperConfigType = {
  label: string, // the text value of the legend or the label
  name?: string, // the machine readable description of the input
  hint?: string,
  errorMessage?: string,
};
