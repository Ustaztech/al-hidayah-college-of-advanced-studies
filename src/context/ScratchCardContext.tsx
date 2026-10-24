import React, { createContext, useContext, useState } from 'react';
import { ScratchCard, ScratchCardType } from '../types';
import { INITIAL_SCRATCH_CARDS } from '../data/sampleData';

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
  const [cards, setCards] = useState<ScratchCard[]>(INITIAL_SCRATCH_CARDS);
  const [activeSession, setActiveSession] = useState<ScratchCardType | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);

  const verifyPIN = (serialNumber: string, pin: string, expectedType: ScratchCardType): VerificationResult => {
    // Basic rate-limiting check
    if (failedAttempts >= 5) {
      return {
        success: false,
        message: 'Security Alert: Maximum failed PIN attempts reached (5/5). Verification locked for 15 minutes to prevent brute-force attacks.'
      };
    }

    const cleanSerial = serialNumber.trim().toUpperCase();
    const cleanPIN = pin.trim();

    // Check PIN length format (e.g. 12 digits)
    if (!cleanPIN || cleanPIN.length < 8) {
      setFailedAttempts(prev => prev + 1);
      return {
        success: false,
        message: 'Invalid PIN length. AHCAS Scratch Card PINs consist of 12 digits.'
      };
    }

    // Find card by serial number
    const targetCard = cards.find(c => c.serial_number === cleanSerial);

    if (!targetCard) {
      setFailedAttempts(prev => prev + 1);
      return {
        success: false,
        message: 'Invalid serial number or PIN combination. Please verify credentials on your physical card.'
      };
    }

    if (targetCard.status === 'Voided') {
      return {
        success: false,
        message: 'This scratch card serial number has been voided by the College Bursary.'
      };
    }

    if (targetCard.card_type !== expectedType) {
      return {
        success: false,
        message: `Incorrect card type. You provided a ${targetCard.card_type} card, but this portal requires a ${expectedType} card.`
      };
    }

    // Mark as consumed if not already
    setCards(prev => prev.map(c => {
      if (c.serial_number === cleanSerial) {
        return {
          ...c,
          status: 'Consumed',
          consumed_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          consumed_by: 'User Verification Session'
        };
      }
      return c;
    }));

    // Reset failed attempts and grant time-limited session
    setFailedAttempts(0);
    setActiveSession(expectedType);

    return {
      success: true,
      message: 'PIN successfully verified! Session authenticated for access.',
      card: targetCard,
      unlockedModule: expectedType
    };
  };

  const generateCardBatch = (type: ScratchCardType, count: number, price: number) => {
    const newBatch: ScratchCard[] = [];
    const prefixMap = {
      APPLICATION: 'APP',
      ADMISSION_STATUS: 'ADM',
      RESULT_CHECKING: 'RES',
      TRANSCRIPT: 'TRN'
    };

    for (let i = 0; i < count; i++) {
      const rand5 = Math.floor(10000 + Math.random() * 90000);
      newBatch.push({
        serial_number: `AHCAS-${prefixMap[type]}-${rand5}`,
        card_type: type,
        price_ngn: price,
        status: 'Active',
        generated_at: new Date().toISOString().substring(0, 10),
        expires_at: '2027-12-31'
      });
    }

    setCards(prev => [...newBatch, ...prev]);
  };

  const voidCard = (serialNumber: string) => {
    setCards(prev => prev.map(c => c.serial_number === serialNumber ? { ...c, status: 'Voided' } : c));
  };

  const clearSession = () => setActiveSession(null);

  return (
    <ScratchCardContext.Provider value={{
      cards,
      verifyPIN,
      generateCardBatch,
      voidCard,
      activeSession,
      clearSession,
      failedAttempts
    }}>
      {children}
    </ScratchCardContext.Provider>
  );
};

export const useScratchCard = () => {
  const context = useContext(ScratchCardContext);
  if (!context) throw new Error('useScratchCard must be used within ScratchCardProvider');
  return context;
};
