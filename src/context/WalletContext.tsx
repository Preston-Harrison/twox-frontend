import React from 'react';
import { configureChains, createClient, goerli, WagmiConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY! }),
    publicProvider(),
  ]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
});

type Props = {
  children: React.ReactNode;
};

export default function WalletProvider(props: Props) {
  return <WagmiConfig client={wagmiClient}>{props.children}</WagmiConfig>;
}
