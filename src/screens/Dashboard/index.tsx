import React, { useCallback, useEffect, useState } from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import { useFocusEffect } from '@react-navigation/native';

import dayjs from 'dayjs';

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
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton
} from './styles';

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {

    const [data, setData] = useState<DataListProps[]>([]);

    async function loadTransactions() {
        const dataKey = '@gofinances:transactions';

        const response = await AsyncStorage.getItem(dataKey);

        const transactions = response ? JSON.parse(response) : [];

        console.log(transactions);

        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {
            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const date = dayjs(item.date).format('DD/MM/YYYY');
            
            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            };

        });

        console.log(transactionsFormatted);
        setData(transactionsFormatted);
    }

    useEffect(() => {
        loadTransactions();

        // AsyncStorage.removeItem('@gofinances:transactions')
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <Container>
            <Header>
                <UserWrapper>

                    <UserInfo>
                        <Photo source={{uri: 'https://avatars.githubusercontent.com/u/69129292?v=4'}} />
                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Danilo</UserName>
                        </User>
                    </UserInfo>

                    <LogoutButton onPress={() => {}}>
                        <Icon name="power"/>
                    </LogoutButton>
                    
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard 
                    type="up"
                    title="Entradas" 
                    amount="R$ 17.400,00"
                    lastTransaction="Última entrada dia 13 de abril" />
                <HighlightCard
                    type="down"
                    title="Saídas" 
                    amount="R$ 1.259,00"
                    lastTransaction="Última saída dia 03 de abril" />
                <HighlightCard
                    type="total"
                    title="Total" 
                    amount="R$ 16.141,00"
                    lastTransaction="01 à 16 de abril" />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionList 
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item}/>}                    
                />
                
            </Transactions>

        </Container>
    )
}
