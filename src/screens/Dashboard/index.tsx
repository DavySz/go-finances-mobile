import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatToBRL } from "brazilian-values";
import { useTheme } from "styled-components";
import moment from "moment";

import { TransactionCardProps } from "../../components/TransactionCard/types";
import { TransactionCard } from "../../components/TransactionCard";
import { HighLightCard } from "../../components/HighLightCard";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighLightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from "./styles";
import { useAuth } from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighLightProps {
  amount: string;
  lastTransaction: string;
}

interface HighLightData {
  total: HighLightProps;
  entries: HighLightProps;
  expensive: HighLightProps;
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highLightData, setHighLightData] = useState<HighLightData>(
    {} as HighLightData
  );
  const [isLoading, setIsLoading] = useState(true);
  const { SignOut, user } = useAuth();
  const theme = useTheme();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: "positive" | "negative"
  ) {
    const collectionFiltered = collection.filter(
      (transaction) => transaction.type === type
    );

    if (collectionFiltered.length === 0) return null;

    return moment(
      new Date(
        Math.max.apply(
          Math,
          collectionFiltered.map((transaction) =>
            new Date(transaction.date).getTime()
          )
        )
      )
    ).format("LL");
  }

  async function loadTransaction() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === "positive") {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        const amount = formatToBRL(Number(item.amount));
        const date = moment(new Date()).format("L");

        return {
          category: item.category,
          name: item.name,
          type: item.type,
          id: item.id,
          amount,
          date,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(
      transactions,
      "positive"
    );
    const lastTransactionExpensive = getLastTransactionDate(
      transactions,
      "negative"
    );

    const total = entriesTotal - expensiveTotal;

    setHighLightData({
      entries: {
        amount: formatToBRL(entriesTotal).toString(),
        lastTransaction: lastTransactionEntries ? lastTransactionEntries : "",
      },
      expensive: {
        amount: formatToBRL(expensiveTotal).toString(),
        lastTransaction: lastTransactionExpensive
          ? lastTransactionExpensive
          : "",
      },
      total: {
        amount: formatToBRL(total).toString(),
        lastTransaction: "",
      },
    });
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransaction();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransaction();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={SignOut} activeOpacity={0.7}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighLightCards>
            <HighLightCard
              type="up"
              title="Entradas"
              amount={highLightData.entries.amount}
              lastTransaction={highLightData.entries.lastTransaction}
            />
            <HighLightCard
              type="down"
              title="Saídas"
              amount={highLightData.expensive.amount}
              lastTransaction={highLightData.expensive.lastTransaction}
            />
            <HighLightCard
              type="total"
              title="Total"
              amount={highLightData.total.amount}
              lastTransaction={highLightData.total.lastTransaction}
            />
          </HighLightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
