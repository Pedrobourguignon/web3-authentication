import { AuthProvider } from "@/contexts";
import { WagmiWrapper } from "@/wrappers";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <WagmiWrapper>
      <SessionProvider session={session}>
        <ChakraProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </ChakraProvider>
      </SessionProvider>
    </WagmiWrapper>
  );
}
