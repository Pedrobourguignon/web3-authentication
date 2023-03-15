import { createClient, configureChains, WagmiConfig } from "wagmi";
import { bsc, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

// Set up chains
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, bsc],
  [publicProvider()]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Web3 Authentication",
      },
    }),
  ],

  provider,
  webSocketProvider,
});

// Set up wrapper interface
interface ProviderProps {
  children: React.ReactNode;
}

// Set up wrapper component
export const WagmiWrapper: React.FC<ProviderProps> = ({ children }) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
);
