import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import React from 'react';
import { createClient, goerli, WagmiConfig } from 'wagmi';

const wagmiClient = createClient(
  getDefaultClient({
    appName: 'Coral',
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    chains: [goerli],
  })
);

type Props = {
  children: React.ReactNode;
};

export default function WalletProvider(props: Props) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ConnectKitProvider theme='midnight'>{props.children}</ConnectKitProvider>
    </WagmiConfig>
  );
}
