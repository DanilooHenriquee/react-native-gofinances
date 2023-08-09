import React, { useEffect } from "react";
import { ThemeProvider } from "styled-components";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from 'react-native';

import {
    useFonts,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
} from "@expo-google-fonts/poppins";

import theme from "./src/global/styles/theme";
import { Register } from "./src/screens/Register";

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
				backgroundColor={ theme.colors.primary }
				barStyle="dark-content"
			/>
			
            <Register />
        </ThemeProvider>
    );
}
