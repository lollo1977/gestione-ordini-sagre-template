import { Github, Mail, Shield, Code2, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Credits() {
  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">

      {/* Hero */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-2xl">
            <Code2 className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Gestione Ordini Sagra</h1>
        <p className="text-gray-500 text-sm">Gestione Ordini per Sagre ed Eventi — Versione 1.0</p>
      </div>

      <Separator />

      {/* Description */}
      <Card className="bg-white rounded-xl shadow-sm border">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-red-500 shrink-0" />
            <span className="font-semibold text-gray-800">Sul Software</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Questo software è stato progettato e sviluppato interamente da{" "}
            <span className="font-semibold text-gray-800">Luna Wolfie (Lorenzo Formento)</span>{" "}
            per offrire velocità, stabilità e semplicità d'uso durante eventi ad alto volume di ordini.
          </p>
        </CardContent>
      </Card>

      {/* License */}
      <Card className="bg-white rounded-xl shadow-sm border">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-primary shrink-0" />
            <span className="font-semibold text-gray-800">Licenza</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Questo software è protetto da{" "}
            <span className="font-semibold text-gray-800">Licenza Proprietaria Luna Wolfie v2.1</span>.
            L'utilizzo gratuito è concesso esclusivamente a organizzazioni no-profit e associazioni di volontariato.
            Qualsiasi utilizzo commerciale richiede l'acquisizione di una licenza PRO.
          </p>
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
            <p className="text-xs font-semibold text-gray-700">Versione Free include:</p>
            <p className="text-xs text-gray-600">• Firma <span className="font-mono">🌕 Applicazione realizzata da Luna Wolfie</span> su ogni scontrino stampato</p>
            <p className="text-xs text-gray-600">• Banner Luna Wolfie nel footer dell'applicazione</p>
            <p className="text-xs font-semibold text-gray-700 mt-2">Versione PRO sblocca:</p>
            <p className="text-xs text-gray-600">• <span className="font-semibold">Rimozione completa della firma dagli scontrini</span> (cucina e cliente)</p>
            <p className="text-xs text-gray-600">• Rimozione del banner footer</p>
            <p className="text-xs text-gray-600">• Esportazione dati (Word / Excel)</p>
            <p className="text-xs text-gray-600">• Personalizzazione completa dei colori del tema</p>
          </div>
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card className="bg-white rounded-xl shadow-sm border">
        <CardContent className="p-6 space-y-4">
          <span className="font-semibold text-gray-800 block">Contatti e Supporto</span>

          <a
            href="https://github.com/lollo1977/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
            data-testid="link-github"
          >
            <Github className="w-5 h-5 text-gray-700 group-hover:text-gray-900 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800">GitHub</p>
              <p className="text-xs text-gray-500">github.com/lollo1977</p>
            </div>
          </a>

          <a
            href="mailto:bibocchia05@gmail.com"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
            data-testid="link-email"
          >
            <Mail className="w-5 h-5 text-gray-700 group-hover:text-gray-900 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800">Email di Supporto</p>
              <p className="text-xs text-gray-500">bibocchia05@gmail.com</p>
            </div>
          </a>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-gray-400 pb-4">
        © 2025 Luna Wolfie (Lorenzo Formento) — Tutti i diritti riservati
      </p>
    </div>
  );
}
