import React, { useState } from 'react';
import { useScratchCard } from '../../context/ScratchCardContext';
import { ScratchCardType } from '../../types';
import { KeyRound, ShieldAlert, CheckCircle, X, CreditCard, Lock } from 'lucide-react';

interface ScratchCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedType: ScratchCardType;
  title: string;
  onSuccessUnlock: () => void;
}

export const ScratchCardModal: React.FC<ScratchCardModalProps> = ({
  isOpen,
  onClose,
  expectedType,
  title,
  onSuccessUnlock
}) => {
  const { verifyPIN, failedAttempts } = useScratchCard();
  const [serialNumber, setSerialNumber] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = verifyPIN(serialNumber, pin, expectedType);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccessUnlock();
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.message);
      }
    }, 600);
  };

  const handleFillDemo = () => {
    const demoSerials: Record<ScratchCardType, { serial: string; pin: string }> = {
      APPLICATION: { serial: 'AHCAS-APP-98214', pin: '984120482910' },
      ADMISSION_STATUS: { serial: 'AHCAS-ADM-44102', pin: '883920147721' },
      RESULT_CHECKING: { serial: 'AHCAS-RES-77189', pin: '119283746509' },
      TRANSCRIPT: { serial: 'AHCAS-TRN-11045', pin: '774620194832' }
    };
    const demo = demoSerials[expectedType];
    setSerialNumber(demo.serial);
    setPin(demo.pin);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#1A222C] w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#006B35] text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard className="text-amber-400" size={20} />
            <h3 className="font-bold text-base font-serif">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-800 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleVerify} className="p-6 space-y-4">
          
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <Lock size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">PIN Security Protocol Active</span>
              AHCAS scratch card PINs are verified through server-side secure hash matching. Enter credentials as printed on your card.
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-300 rounded-lg flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600 shrink-0" />
              <div className="font-medium">{successMsg}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Card Serial Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AHCAS-ADM-44102"
              value={serialNumber}
              onChange={e => setSerialNumber(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm uppercase tracking-wider font-mono focus:ring-2 focus:ring-[#006B35]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              12-Digit Scratch Card PIN
            </label>
            <input
              type="password"
              required
              maxLength={12}
              placeholder="•••• •••• ••••"
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-mono tracking-widest focus:ring-2 focus:ring-[#006B35]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-[#006B35] dark:text-emerald-400 hover:underline font-medium"
            >
              [Auto-fill Demo Card]
            </button>
            <span className="text-[11px] text-gray-500">
              Failed Attempts: {failedAttempts}/5
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#006B35] hover:bg-[#004D26] text-white font-bold rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Validating PIN Hash...</span>
            ) : (
              <>
                <KeyRound size={16} />
                <span>Verify Credentials & Access</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
