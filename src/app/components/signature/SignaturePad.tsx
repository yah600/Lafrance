import { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../ui/button';
import { RotateCcw } from 'lucide-react';

interface SignaturePadProps {
  onSave?: (signature: string) => void;
  onClear?: () => void;
  penColor?: string;
  canvasProps?: any;
}

export function SignaturePad({
  onSave,
  onClear,
  penColor = '#000000',
  canvasProps,
}: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    sigCanvas.current?.clear();
    onClear?.();
  };

  const handleSave = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();
      onSave?.(dataURL);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: 'w-full h-48 touch-none',
            ...canvasProps,
          }}
          penColor={penColor}
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={handleClear} className="flex-1">
          <RotateCcw className="h-4 w-4 mr-2" />
          Effacer
        </Button>
        {onSave && (
          <Button type="button" onClick={handleSave} className="flex-1">
            Sauvegarder
          </Button>
        )}
      </div>
    </div>
  );
}
