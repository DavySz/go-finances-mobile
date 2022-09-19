import React from "react";

import { TextInputProps } from "react-native";
import { Container } from "./styles";

interface IInput extends TextInputProps {
  active?: boolean;
}

export function Input({ active = false, ...rest }: IInput) {
  return <Container {...rest} active={active} />;
}
