import { useAuth, useToasty } from "@/hooks";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
} from "@chakra-ui/react";
import { Connector, useAccount, useConnect } from "wagmi";

interface IBasicModal {
  onClose: () => void;
  isOpen: boolean;
}

export const WalletOptionsModal: React.FC<IBasicModal> = ({
  isOpen,
  onClose,
}) => {
  const { handleSignIn } = useAuth();
  const { isConnected, address } = useAccount();
  const { toast } = useToasty();
  const { connectors, connect, connectAsync, status } = useConnect({
    async onSuccess(data) {
      const account = data.account;
      handleSignIn(account);
      onClose();
    },
  });

  const connectWalletButton = async (
    connector: Connector<any, any, any> | undefined
  ) => {
    try {
      if (status !== "success") {
        onClose();
        if (!isConnected) {
          await connectAsync({ connector });
          return;
        }
        handleSignIn(address);
      } else {
        onClose();
        await handleSignIn(address);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "The request was rejected. Please try again.",
        status: "error",
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect to a Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap="3">
            {connectors.map((connector, index) => (
              <Button
                key={+index}
                onClick={() => connectWalletButton(connector)}
              >
                {connector.name}
              </Button>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
