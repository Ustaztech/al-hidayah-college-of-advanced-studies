import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScratchCard, ScratchCardType } from '../types';
import { db } from '../services/db';

interface VerificationResult {
  success: boolean;
  message: string;
  card?: ScratchCard;
  unlockedModule?: ScratchCardType;
}

interface ScratchCardContextType {
  cards: ScratchCard[];
  verifyPIN: (serialNumber: string, pin: string, expectedType: ScratchCardType) => VerificationResult;
  generateCardBatch: (type: ScratchCardType, count: number, price: number) => void;
  voidCard: (serialNumber: string) => void;
  activeSession: ScratchCardType | null;
  clearSession: () => void;
  failedAttempts: number;
}

const ScratchCardContext = createContext<ScratchCardContextType | undefined>(undefined);

export const ScratchCardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<ScratchCard[]>(() => db.getScratchCards());
  const [activeSession, setActiveSession] = useState<ScratchCardType | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);

  const refreshCards = () => {
    setCards(db.getScratchCards());
  };

  const verifyPIN = (serialNumber: string, pin: string, expectedType: ScratchCardType): VerificationResult => {
    if (failedAttempts >= 5) {
      return {
        success: false,
        message: 'Security Alert: Maximum failed PIN attempts reached (5/5). Verification locked for 15 minutes to prevent brute-force attacks.'
      };
    }

    const cleanPIN = pin.trim();
    if (!cleanPIN || cleanPIN.length < 6) {
      setFailedAttempts(prev => prev + 1);
      return {
        success: false,
        message: 'Invalid PIN length. AHCAS Scratch Card PINs must be entered accurately.'
      };
    }

    const res = db.verifyScratchCard(serialNumber, pin, expectedType);
    if (!res.success) {
      setFailedAttempts(prev => prev + 1);
      return {
        success: false,
        message: res.message
      };
    }

    setFailedAttempts(0);
    setActiveSession(expectedType);
    refreshCards();

    return {
      success: true,
      message: 'PIN successfully verified! Access granted.',
      card: res.card,
      unlockedModule: expectedType
    };
  };

  const generateCardBatch = (type: ScratchCardType, count: number, price: number) => {
    db.generateScratchCards(type, count, price);
    refreshCards();
  };

  const voidCard = (serialNumber: string) => {
    const all = db.getScratchCards();
    const updated = all.map(c => c.serial_number === serialNumber ? { ...c, status: 'Voided' as const } : c);
    localStorage.setItem('ahcas_v3_clean_cards', JSON.stringify(updated));
    refreshCards();
  };

  const clearSession = () => setActiveSession(null);

  return (
    <ScratchCardContext.Provider
      value={{
        cards,
        verifyPIN,
        generateCardBatch,
        voidCard,
        activeSession,
        clearSession,
        failedAttempts
      }}
    >
      {children}
    </ScratchCardContext.Provider>
  );
};

export const useScratchCard = () => {
  const context = useContext(ScratchCardContext);
  if (!context) throw new Error('useScratchCard must be used within ScratchCardProvider');
  return context;
};
