import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";

export const Container = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.shape};
  flex-direction: row;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 16px;
`;
export const IconWrapper = styled.View`
  border-right-color: ${({ theme }) => theme.colors.background};
  border-right-width: 1px;
  padding: 16px;
`;

export const Title = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.title};
  font-family: ${({ theme }) => theme.fonts.medium};
  text-align: center;
  width: 100%;
`;