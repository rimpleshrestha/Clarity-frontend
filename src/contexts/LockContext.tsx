import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface JournalUnlockContextType {
  unlockToken: string | null;
  isLocked: boolean;
  showModal: boolean;
  unlock: (token: string) => void;
  lock: () => void;
  requestUnlock: () => Promise<string>;
}

const JournalUnlockContext = createContext<
  JournalUnlockContextType | undefined
>(undefined);

export const JournalUnlockProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [unlockToken, setUnlockToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resolver, setResolver] = useState<((token: string) => void) | null>(
    null
  );

  const unlock = (token: string) => {
    setUnlockToken(token);
    setShowModal(false);

    // Auto-expire after 5 minutes
    setTimeout(() => {
      setUnlockToken(null);
    }, 5 * 60 * 1000);

    if (resolver) {
      resolver(token);
      setResolver(null);
    }
  };

  const lock = () => {
    setUnlockToken(null);
    setShowModal(true);
  };

  const requestUnlock = (): Promise<string> => {
    if (unlockToken) {
      return Promise.resolve(unlockToken);
    }

    setShowModal(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  return (
    <JournalUnlockContext.Provider
      value={{
        unlockToken,
        isLocked: !unlockToken,
        showModal,
        unlock,
        lock,
        requestUnlock,
      }}
    >
      {children}
    </JournalUnlockContext.Provider>
  );
};

export const useJournalUnlock = () => {
  const context = useContext(JournalUnlockContext);
  if (!context) {
    throw new Error(
      "useJournalUnlock must be used within JournalUnlockProvider"
    );
  }
  return context;
};
