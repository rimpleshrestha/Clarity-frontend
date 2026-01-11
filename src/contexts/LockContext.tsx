"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

interface JournalUnlockContextType {
  unlockToken: string | null;
  isLocked: boolean;
  showModal: boolean;
  unlock: (token: string) => void;
  closeModal: () => void;
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

  // Ref to track the auto-expiration timer
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Clears any existing expiration timer
   */
  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  /**
   * Called when the PIN is successfully verified via the API
   */
  const unlock = (token: string) => {
    setUnlockToken(token);
    setShowModal(false);

    // Reset timer: clear old one and start a fresh 5-minute countdown
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      setUnlockToken(null);
      console.log("Journal session expired.");
    }, 5 * 60 * 1000);

    // Resolve the promise for any component waiting for this token
    if (resolver) {
      resolver(token);
      setResolver(null);
    }
  };

  /**
   * Requests a token. If one exists, it returns it immediately.
   * If not, it opens the PIN modal and returns a promise that
   * resolves once the user successfully unlocks.
   */
  const requestUnlock = (): Promise<string> => {
    if (unlockToken) return Promise.resolve(unlockToken);

    setShowModal(true);
    return new Promise((resolve) => setResolver(() => resolve));
  };

  /**
   * Closes the modal manually (e.g., clicking 'X' or navigating away)
   */
  const closeModal = () => {
    setShowModal(false);
    setResolver(null); // Cleanup the pending promise
  };

  // Cleanup timer if the entire Provider unmounts (rare but good practice)
  useEffect(() => {
    return () => clearTimer();
  }, []);

  return (
    <JournalUnlockContext.Provider
      value={{
        unlockToken,
        isLocked: !unlockToken,
        showModal,
        unlock,
        requestUnlock,
        closeModal,
      }}
    >
      {children}
    </JournalUnlockContext.Provider>
  );
};

export const useJournalUnlock = () => {
  const context = useContext(JournalUnlockContext);
  if (!context)
    throw new Error(
      "useJournalUnlock must be used within JournalUnlockProvider"
    );
  return context;
};
