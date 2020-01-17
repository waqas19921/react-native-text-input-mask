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
  refInput?: React.LegacyRef<TextInput>;
}

export default <React.FC<TextInputMaskProps>>(
  function TextInputMask(): JSX.Element {}
);
