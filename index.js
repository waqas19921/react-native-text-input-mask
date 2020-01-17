import React, { useEffect, useState, useRef } from "react";

import {
  TextInput,
  findNodeHandle,
  NativeModules,
  Platform
} from "react-native";

const mask = NativeModules.RNTextInputMask.mask;
const unmask = NativeModules.RNTextInputMask.unmask;
const setMask = NativeModules.RNTextInputMask.setMask;
export { mask, unmask, setMask };

const TextInputMask = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  const masked = useRef(false);
  const [prevMask, setPrevMask] = useState(props.mask);
  const [prevValue, setPrevValue] = useState(props.mask);

  useEffect(() => {
    if (props.maskDefaultValue && props.mask && props.value) {
      mask(
        props.mask,
        "" + props.value,
        text => inputRef.current && inputRef.current.setNativeProps({ text })
      );
    }

    if (props.mask && !masked.current) {
      masked.current = true;
      inputRef.current && setMask(findNodeHandle(inputRef.current), props.mask);
    }
  }, []);

  if (prevValue !== props.value) {
    props.mask &&
      mask(
        props.mask,
        "" + props.value,
        text => !!inputRef.current && inputRef.current.setNativeProps({ text })
      );
    setPrevValue(props.value);
  }

  if (prevMask !== props.mask) {
    inputRef.current && setMask(findNodeHandle(inputRef.current), props.mask);
    setPrevMask(props.mask);
  }

  return (
    <TextInput
      {...props}
      value={undefined}
      ref={textInputRef => {
        inputRef.current = textInputRef;
        ref && ref(textInputRef);
      }}
      multiline={props.mask && Platform.OS === "ios" ? false : props.multiline}
      onChangeText={masked => {
        if (props.mask) {
          const _unmasked = unmask(props.mask, masked, unmasked => {
            props.onChangeText && props.onChangeText(masked, unmasked);
          });
        } else {
          props.onChangeText && props.onChangeText(masked);
        }
      }}
    />
  );
});

TextInputMask.defaultProps = {
  maskDefaultValue: true
};

export default TextInputMask;
