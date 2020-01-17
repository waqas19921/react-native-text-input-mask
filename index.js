import React, { useEffect, useLayoutEffect, useRef } from "react";

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

function useCombinedRefs(...refs) {
  const targetRef = useRef()

  useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}

const TextInputMask = React.forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, inputRef)
  const masked = useRef(false);
  const isMounted = useRef(false);

  useLayoutEffect(() => {
    if (props.maskDefaultValue && props.mask && props.value)
      mask(
        props.mask,
        "" + props.value,
        text => inputRef.current && inputRef.current.setNativeProps({ text })
      );
    if (props.mask && !masked.current) {
      inputRef.current && setMask(findNodeHandle(inputRef.current), props.mask);
      masked.current = true;
    }
    isMounted.current = true;
    return ()=>{
      isMounted.current = false
    }
  }, []);

  // Check if value change
  useEffect(() => {
    isMounted.current && props.mask && mask(
      props.mask,
      "" + props.value,
      text => inputRef.current && inputRef.current.setNativeProps({ text })
    );
  }, [props.value]);
  
  //Check if mask change
  useEffect(() => {
    isMounted.current && inputRef.current && setMask(findNodeHandle(inputRef.current), props.mask);
  }, [props.mask]);

  return (
    <TextInput
      {...props}
      value={undefined}
      ref={combinedRef}
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

export default React.memo(TextInputMask);
