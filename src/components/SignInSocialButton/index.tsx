import React from "react";
import { SvgProps } from "react-native-svg";
import { TouchableOpacityProps } from "react-native";
import { Container, IconWrapper, Title } from "./styles";

interface Props extends TouchableOpacityProps {
  title: string;
  svg: React.FC<SvgProps>;
}

export function SignInSocialButton({ title, svg: Svg, ...rest }: Props) {
  return (
    <Container activeOpacity={0.9} {...rest}>
      <IconWrapper>
        <Svg />
      </IconWrapper>
      <Title>{title}</Title>
    </Container>
  );
}
