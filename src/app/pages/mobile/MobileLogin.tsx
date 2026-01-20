import { useState } from 'react';
import { Flame, Lock, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function MobileLogin() {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)] flex flex-col">
      {/* Header */}
      <div className="p-6 text-center text-white">
        <Flame className="h-16 w-16 mx-auto mb-4 text-[var(--flame-orange)]" />
        <h1 className="text-2xl font-bold">Plomberie D'Experts</h1>
        <p className="text-blue-100 mt-2">App Technicien</p>
      </div>

      {/* Login Card */}
      <div className="flex-1 bg-white rounded-t-3xl p-6 mt-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue</h2>
          <p className="text-gray-600 mb-8">Entrez votre code PIN pour continuer</p>

          {/* PIN Display */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-16 h-16 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-2xl font-bold"
              >
                {pin[index] ? (showPin ? pin[index] : '•') : ''}
              </div>
            ))}
          </div>

          {/* PIN Keyboard */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handlePinInput(num.toString())}
                className="h-16 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-2xl font-semibold"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setShowPin(!showPin)}
              className="h-16 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center"
            >
              {showPin ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </button>
            <button
              onClick={() => handlePinInput('0')}
              className="h-16 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-2xl font-semibold"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="h-16 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all text-lg font-semibold"
            >
              ⌫
            </button>
          </div>

          {/* Biometric */}
          <div className="text-center mb-6">
            <Button variant="ghost" className="gap-2">
              <Fingerprint className="h-5 w-5" />
              Utiliser Touch ID / Face ID
            </Button>
          </div>

          {/* Forgot PIN */}
          <div className="text-center">
            <button className="text-sm text-blue-600 hover:underline">
              Code PIN oublié?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
