import React, { createContext, useMemo, useEffect } from "react";
import { useSignMessage } from "wagmi";
import { useToasty } from "@/hooks";
import { v4 as uuidv4 } from "uuid";
import { signIn, useSession } from "next-auth/react";

interface IAuthContext {
  getNonce: () => Promise<string>;
  getSignature: (nonce: string) => Promise<`0x${string}` | undefined>;
  handleSignIn: (account: `0x${string}` | undefined) => Promise<void>;
}

export const AuthContext = createContext({} as IAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToasty();
  const { signMessageAsync } = useSignMessage();
  const { data: session } = useSession();

  const getNonce = async () => {
    try {
      const nonce = uuidv4();
      return nonce;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const getSignature = async (nonce: string) => {
    try {
      const signature = await signMessageAsync({
        message: nonce,
      });
      return signature;
    } catch (error: any) {
      if (error.message.includes("User rejected")) {
        toast({
          title: "Error",
          description: "The signature was cancelled. Please try again.",
          status: "error",
        });
        return;
      }
      throw new Error(error);
    }
  };

  const handleSignIn = async (account: `0x${string}` | undefined) => {
    try {
      const nonce = await getNonce();
      const signature = await getSignature(nonce);
      if (signature) {
        signIn("credentials", {
          redirect: false,
          signature,
        });
      }
      return;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (session) {
      if (!localStorage.getItem("jwt-authorization")) {
        localStorage.setItem("jwt-authorization", session.user); // please uncomment this line
      }
    }
  }, [session]);

  const contextStates = useMemo(
    () => ({
      getNonce,
      getSignature,
      handleSignIn,
    }),
    []
  );

  return (
    <AuthContext.Provider value={contextStates}>
      {children}
    </AuthContext.Provider>
  );
};
