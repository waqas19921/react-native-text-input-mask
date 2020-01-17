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

function TextInputMask(props) {
  const inputRef = useRef();
  const masked = useRef(false);
  const [prevValue, setPrevValue] = useState(props.value);
  const [prevMask, setPrevMask] = useState(props.mask);

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
      setMask(findNodeHandle(inputRef.current), props.mask);
    }
  }, []);

  if (props.mask && prevValue !== props.value) {
    mask(
      prevValue,
      "" + value,
      text => inputRef.current && inputRef.current.setNativeProps({ text })
    );
    setPrevValue(props.value);
  }

  if (prevMask !== props.mask) {
    setMask(findNodeHandle(inputRef.current), props.mask);
    setPrevMask(props.mask);
  }

  return (
    <TextInput
      {...props}
      value={undefined}
      ref={ref => {
        inputRef.current = ref;
        if (typeof props.refInput === "function") {
          props.refInput(ref);
        }
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
}

TextInputMask.defaultProps = {
  maskDefaultValue: true
};

export default TextInputMask;
