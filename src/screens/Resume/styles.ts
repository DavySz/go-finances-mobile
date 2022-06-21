import styled from "styled-components/native";
import { RFValue } from 'react-native-responsive-fontsize';
import {AnyStyledComponent} from "styled-components";
import {Feather} from '@expo/vector-icons'

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme })=>theme.colors.background};
`;

export const Header = styled.View`
    background-color: ${({ theme })=>theme.colors.primary};

    width: 100%;
    height: ${RFValue(113)}px;

    align-items: center;
    justify-content: flex-end;

    padding-bottom:16px;
`;

export const Title = styled.Text`
   font-family: ${({ theme })=>theme.fonts.regular};
   font-size: ${RFValue(18)}px;
   color: ${({ theme })=>theme.colors.background};
`;

export const Content = styled.ScrollView``

export const ChartContainer = styled.View`
    width: 100%;
    align-items: center;
`
export const MonthSelector = styled.View`
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items:center;
    margin-top:24px;
`
export const MonthSelectButton = styled.TouchableOpacity``

export const MonthSelectIcon = styled(Feather as unknown as AnyStyledComponent)`
    font-size: ${RFValue(24)}px;
`

export const Month = styled.Text`
    font-family:${({ theme })=>theme.fonts.regular};
    font-size: ${RFValue(20)}px;
`

export const LoadContainer = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`