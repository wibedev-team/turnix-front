'use client';

import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
	ConnectButton,
	getDefaultWallets,
	RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon, zora } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
	[mainnet, polygon, optimism, arbitrum, base, zora],
	[alchemyProvider({ apiKey: process.env.ALCHEMY_ID ?? '' }), publicProvider()]
);

const { connectors } = getDefaultWallets({
	appName: 'My RainbowKit App',
	projectId: 'YOUR_PROJECT_ID',
	chains,
});

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
});

export default function Home() {
	return (
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider chains={chains}>
				<ConnectButton />
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

