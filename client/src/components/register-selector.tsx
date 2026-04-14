import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor } from "lucide-react";

interface RegisterSelectorProps {
  numberOfRegisters: number;
  onRegisterSelect: (registerId: number) => void;
}

export default function RegisterSelector({ numberOfRegisters, onRegisterSelect }: RegisterSelectorProps) {
  const [selectedRegister, setSelectedRegister] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedRegister) {
      onRegisterSelect(selectedRegister);
    }
  };

  const registers = Array.from({ length: numberOfRegisters }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Seleziona Cassa
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Scegli quale cassa stai utilizzando per la sincronizzazione
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid gap-3 ${numberOfRegisters <= 2 ? "grid-cols-1" : numberOfRegisters <= 4 ? "grid-cols-2" : "grid-cols-3"}`}>
            {registers.map((n) => (
              <Button
                key={n}
                data-testid={`button-cassa-${n}`}
                variant={selectedRegister === n ? "default" : "outline"}
                className={`h-20 flex flex-col items-center justify-center space-y-1 ${
                  selectedRegister === n
                    ? "bg-primary text-white"
                    : "border-2 hover:border-primary"
                }`}
                onClick={() => setSelectedRegister(n)}
              >
                <Monitor className="w-6 h-6" />
                <span className="font-semibold text-base">CASSA {n}</span>
              </Button>
            ))}
          </div>

          {selectedRegister && (
            <div className="mt-4">
              <Button
                data-testid="button-confirm-register"
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
            <p>tra tutte le casse in tempo reale via WebSocket</p>
            <p className="text-green-600 font-semibold">✅ Stampa ottimizzata per PC e Android</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
