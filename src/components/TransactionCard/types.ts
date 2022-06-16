export type CategoryType = {
    name: string;
    icon: string;
}

export type TransactionCardProps = {
    type: 'positive' | 'negative';
    title: string;
    amount: string;
    category: CategoryType;
    date: string;
}
