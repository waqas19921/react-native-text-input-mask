import * as React from "react";
import { TextInputProps, TextInput } from "react-native";

export type onChangeTextCallback = (
  formatted: string,
  extracted?: string
) => void;

export interface TextInputMaskProps
  extends Omit<TextInputProps, "onChangeText"> {
  maskDefaultValue?: boolean;
  mask?: string;
  onChangeText?: onChangeTextCallback;
}

export default React.forwardRef<TextInput, TextInputMaskProps>(function(
  props,
  ref
): JSX.Element {});
