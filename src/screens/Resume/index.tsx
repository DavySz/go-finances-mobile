import React, { useCallback, useEffect, useState } from "react";
import { ptBR } from "date-fns/locale";
import { VictoryPie } from "victory-native";
import { useTheme } from "styled-components";
import { ActivityIndicator } from "react-native";
import { formatToBRL } from "brazilian-values";
import { addMonths, subMonths, format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { categories } from "../../utils/categories";
import { HistoryCard } from "../../components/HistoryCard";

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelector,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from "./styles";
import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";

export interface TransactionData {
  type: "positive" | "negative";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [totalCategories, setTotalCategories] = useState<CategoryData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = useTheme();

  function handleChangeDate(action: "next" | "prev") {
    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensive = responseFormatted.filter(
      (expensive: TransactionData) =>
        expensive.type === "negative" &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensiveTotal = expensive.reduce(
      (accumulator: number, expensive: TransactionData) => {
        return accumulator + Number(expensive.amount);
      },
      0
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;
      expensive.forEach((expensive: TransactionData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        const percent = `${((categorySum / expensiveTotal) * 100).toFixed(0)}%`;
        totalByCategory.push({
          percent,
          key: category.key,
          total: categorySum,
          name: category.name,
          color: category.color,
          totalFormatted: formatToBRL(categorySum),
        });
      }
    });
    setTotalCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelector>
            <MonthSelectButton
              activeOpacity={0.7}
              onPress={() => handleChangeDate("prev")}
            >
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>
            <Month>
              {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
            </Month>
            <MonthSelectButton
              activeOpacity={0.7}
              onPress={() => handleChangeDate("next")}
            >
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelector>
          <ChartContainer>
            <VictoryPie
              data={totalCategories}
              x="percent"
              y="total"
              colorScale={totalCategories.map((category) => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: "bold",
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={70}
            />
          </ChartContainer>
          {totalCategories.map((category) => (
            <HistoryCard
              key={category.key}
              title={category.name}
              amount={category.totalFormatted}
              color={category.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
}
