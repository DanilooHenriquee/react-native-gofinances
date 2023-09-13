import React, { useEffect } from "react";
import { ThemeProvider } from "styled-components";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from 'react-native';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import {
    useFonts,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
} from "@expo-google-fonts/poppins";

import theme from "./src/global/styles/theme";

import { Routes } from "./src/routes";

import { AuthProvider } from "./src/hooks/auth";

export default function App() {

	const [isLoaded] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_700Bold
	});

	useEffect(() => {
		async function showSplashScreen() {
			await SplashScreen.preventAutoHideAsync();
		}
	
		showSplashScreen();
	}, []);

	useEffect(() => {
		const hideSplashScreen = async () => {
			await SplashScreen.hideAsync();
		};

		if (isLoaded)
			hideSplashScreen();

	}, [isLoaded]);
	
	if (!isLoaded) return null;

    return (
        <ThemeProvider theme={theme}>
					
			<StatusBar
				backgroundColor={theme.colors.primary}
				barStyle="light-content"
			/>
			<AuthProvider>
				<Routes />
			</AuthProvider>
			
        </ThemeProvider>
    );
}
