import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { HistoryCard } from "../../components/HistoryCard";
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "styled-components";

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
} from './styles';

import { categories } from "../../../utils/categories";

interface TransactionData {
    type      : 'positive' | 'negative';
    name      : string;
    amount    : string;
    category  : string;
    date      : string;
}

interface CategoryData {
    key             : string;
    name            : string;
    color           : string;
    total           : number;
    totalFormatted  : string;
    percent         : string;
}

export function Resume() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();
    const bottomTabBarHeight = useBottomTabBarHeight();

    function handleDateChange(action: 'next' | 'prev') {
        setIsLoading(true);

        if (action === 'next')
            setSelectedDate(addMonths(selectedDate, 1));
        else
            setSelectedDate(subMonths(selectedDate, 1));
    }

    async function loadData() {
        const dataKey           = '@gofinances:transactions';
        const response          = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
            .filter((expensive: TransactionData) => 
                expensive.type === 'negative' &&
                new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
                new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
            );

        const expensivesTotal = expensives
            .reduce((acc: number, expensive: TransactionData) => {
                return acc + Number(expensive.amount);
            }, 0);

        const totalByCategory : CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key)
                    categorySum += Number(expensive.amount);

            });

            if (categorySum > 0) {

                const total           = categorySum;                
                const totalFormatted  = categorySum
                    .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;
                
                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    totalFormatted,
                    total,
                    percent
                });
            }
                
        });

        setTotalByCategories(totalByCategory);
        setIsLoading(false);
    }

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    useFocusEffect(useCallback(() => {
        loadData();
    }, []));

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            { 
                isLoading ? 
                <LoadContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size='large'
                    />
                </LoadContainer> :

                <Content
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: bottomTabBarHeight
                        }}            
                    >

                        <MonthSelect>
                            <MonthSelectButton onPress={() => handleDateChange('prev')}>
                                <MonthSelectIcon name="chevron-left" />
                            </MonthSelectButton>

                            <Month> { format(selectedDate, 'MMMM, yyyy', { locale: ptBR }) }</Month>

                            <MonthSelectButton onPress={() => handleDateChange('next')}>
                                <MonthSelectIcon name="chevron-right" />
                            </MonthSelectButton>
                        </MonthSelect>

                        <ChartContainer>
                            <VictoryPie 
                                data={totalByCategories}
                                colorScale={totalByCategories.map(category => category.color)}
                                style={{
                                    labels: {
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape
                                    }
                                }}
                                labelRadius={50}
                                x="percent"
                                y="total"
                            />
                        </ChartContainer>

                        {
                            totalByCategories.map(item => (
                                <HistoryCard 
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }
                </Content>
            }
        </Container>
    );
}