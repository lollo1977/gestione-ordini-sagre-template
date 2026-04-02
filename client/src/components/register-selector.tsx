import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Smartphone } from "lucide-react";

interface RegisterSelectorProps {
  onRegisterSelect: (registerId: 1 | 2) => void;
}

export default function RegisterSelector({ onRegisterSelect }: RegisterSelectorProps) {
  const [selectedRegister, setSelectedRegister] = useState<1 | 2 | null>(null);

  const handleConfirm = () => {
    if (selectedRegister) {
      onRegisterSelect(selectedRegister);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Seleziona Cassa
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Scegli quale cassa stai utilizzando per la sincronizzazione
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant={selectedRegister === 1 ? "default" : "outline"}
              className={`h-20 flex flex-col items-center justify-center space-y-2 ${
                selectedRegister === 1 
                  ? "bg-primary text-white" 
                  : "border-2 hover:border-primary"
              }`}
              onClick={() => setSelectedRegister(1)}
            >
              <Monitor className="w-8 h-8" />
              <span className="font-semibold">CASSA 1</span>
              <span className="text-xs opacity-80">PC / Principale</span>
            </Button>

            <Button
              variant={selectedRegister === 2 ? "default" : "outline"}
              className={`h-20 flex flex-col items-center justify-center space-y-2 ${
                selectedRegister === 2 
                  ? "bg-secondary text-white" 
                  : "border-2 hover:border-secondary"
              }`}
              onClick={() => setSelectedRegister(2)}
            >
              <Smartphone className="w-8 h-8" />
              <span className="font-semibold">CASSA 2</span>
              <span className="text-xs opacity-80">Mobile / Secondaria</span>
            </Button>
          </div>

          {selectedRegister && (
            <div className="mt-6">
              <Button 
                onClick={handleConfirm}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                Conferma Cassa {selectedRegister}
              </Button>
            </div>
          )}

          <div className="text-center text-xs text-gray-500 mt-4 space-y-1">
            <p>📱💻 Gli ordini si sincronizzeranno automaticamente</p>
            <p>tra le due casse in tempo reale via WebSocket</p>
            <p className="text-green-600 font-semibold">✅ Stampa ottimizzata per PC e Android</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}