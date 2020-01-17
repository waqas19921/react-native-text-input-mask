import React, { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes} from "react";
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

declare const TextInputMask : ForwardRefExoticComponent<PropsWithoutRef<TextInputMaskProps> & RefAttributes<TextInput>>;

export default TextInputMask;