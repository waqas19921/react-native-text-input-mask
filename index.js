import React, { useEffect, useRef, useImperativeHandle, useCallback } from "react";

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

function TextInputMask(props, ref){
  const inputRef = useRef();
  const prevMask = useRef(props.mask)
  const prevValue = useRef(props.value)
  const masked = useRef(false);
  const isMounted = useRef(false);

 const setNativeMask = useCallback(
  (newInputMask)=>{
    inputRef.current && setMask(findNodeHandle(inputRef.current), newInputMask);
  },[inputRef.current]);

  const setNativeTextMask = useCallback((value, inputMask)=>{
    inputMask && mask(
      inputMask,
      "" + value,
      text =>{
        inputRef.current && inputRef.current.setNativeProps({ text });
        prevValue.current = ""+ value;
      }
    );
   },[inputRef.current, prevValue.current]);

  const onChangeText = useCallback(masked => {
    if(masked === prevValue.current) return;
      if (props.mask) {
        const _unmasked = unmask(props.mask, masked, unmasked => {
          props.onChangeText && props.onChangeText(masked, unmasked);
        });
      } else {
        props.onChangeText && props.onChangeText(masked);
      }
  },[props.onChangeText,prevValue.current])
  
  useImperativeHandle(ref,()=>({
    isFocused : ()=>{
      return inputRef.current && inputRef.current.isFocused()
    },
    focus: ()=>{
      return inputRef.current && inputRef.current.focus();
    },
    blur : ()=>{
      return inputRef.current && inputRef.current.blur();
    },
    clear: ()=>{
      return inputRef.current && inputRef.current.clear();
    },
    setNativeProps :  ({ mask: inputMask, text, ...nativeProps})=>{
      if( (inputMask || props.mask) && (text || props.value)) setNativeTextMask(text || props.value, inputMask || props.mask);
      if(inputMask !== props.mask) setNativeMask(inputMask);
      return Object.keys(nativeProps).length && inputRef.current && inputRef.current.setNativeProps(nativeProps)
    }
  }));
 
 useEffect(() => {
   if (props.maskDefaultValue && props.mask && props.value) setNativeTextMask(props.value, props.mask)
    if (props.mask && !masked.current) {
      setNativeMask(props.mask);
      masked.current = true;
    }
    isMounted.current = true;
    return ()=>{
      isMounted.current = false
    }
  }, []);

  // Check if value change
  if(props.value !== prevValue.current){
      isMounted.current && setNativeTextMask(props.value,props.mask);
  }
  //Check if mask change
  if(props.mask !== prevMask.current){
    isMounted.current && setNativeMask(props.mask);
    prevMask.current = props.mask;
  }

  return (
    <TextInput
      ref={inputRef}
      {...props}
      value={undefined}
      multiline={props.mask && Platform.OS === "ios" ? false : props.multiline}
      onChangeText={onChangeText}
    />
  );
}

TextInputMask = React.forwardRef(TextInputMask);

TextInputMask.defaultProps = {
  maskDefaultValue: true
};

export default React.memo(TextInputMask,(prevProps,nextProps)=>prevProps.mask === nextProps.mask && prevProps.value === nextProps.value);
