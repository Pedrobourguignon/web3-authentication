import { WalletOptionsModal } from "@/components";
import { Flex, Button, useDisclosure, Text } from "@chakra-ui/react";
import { useAccount, useDisconnect } from "wagmi";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { disconnect } = useDisconnect();
  const { data: session } = useSession();

  const handleSignIn = () => {
    onOpen();
  };

  const handleSignOut = () => {
    disconnect();
    signOut();
  };

  return (
    <Flex align="center" w="100%" justify="center" h="100vh">
      <WalletOptionsModal isOpen={isOpen} onClose={onClose} />
      <Button onClick={session ? () => handleSignOut() : () => handleSignIn()}>
        <Text>{session ? "Disconnect" : "Connect Wallet"}</Text>
      </Button>
    </Flex>
  );
}
