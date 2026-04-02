import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Euro, Receipt, Download, FileText, Table, PieChart, Banknote, Clock, CreditCard, Trash2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { exportToWord, exportToExcel } from "@/utils/export-utils";
import { apiRequest } from "@/lib/queryClient";
import type { DailyStats } from "@shared/schema";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useLicense } from "@/hooks/use-license";

export default function Reports() {
  const settings = useAppSettings();
  const { isPro } = useLicense();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery<DailyStats>({
    queryKey: ["/api/analytics/daily"],
    refetchInterval: 5000,
    staleTime: 0,
  });

  const clearDataMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", "/api/data/clear-except-menu"),
    onSuccess: () => {
      toast({ title: "Dati cancellati", description: "Tutti i dati sono stati cancellati tranne il menù" });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/daily"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/active"] });
    },
    onError: () => {
      toast({ title: "Errore", description: "Si è verificato un errore durante la cancellazione dei dati", variant: "destructive" });
    },
  });

  const handleLockedExport = () => {
    toast({
      title: "🔒 Funzione PRO",
      description: "Attiva la licenza PRO nelle Impostazioni per sbloccare l'esportazione.",
      variant: "destructive",
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Caricamento statistiche...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">Errore nel caricamento delle statistiche</div>;
  }

  return (
    <div className="space-y-6">
      {/* Export and Data Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Download className="mr-2 text-primary" />
              Esporta Report
              {!isPro && <Badge variant="secondary" className="ml-2 text-xs">PRO</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isPro && (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                🔒 L'esportazione è disponibile nella versione PRO. Attiva la licenza nelle Impostazioni.
              </p>
            )}
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={isPro ? () => exportToWord(stats, settings) : handleLockedExport}
                className={`flex items-center gap-2 ${isPro ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-400 cursor-not-allowed"}`}
                data-testid="button-exportWord"
              >
                {isPro ? <FileText className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                Scarica Word (.rtf)
              </Button>
              <Button
                onClick={isPro ? () => exportToExcel(stats, settings) : handleLockedExport}
                className={`flex items-center gap-2 ${isPro ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 hover:bg-gray-400 cursor-not-allowed"}`}
                data-testid="button-exportExcel"
              >
                {isPro ? <Table className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                Scarica Excel (.csv)
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              I file conterranno tutti i dati del report giornaliero
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Trash2 className="mr-2 text-red-600" />
              Gestione Dati
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  disabled={clearDataMutation.isPending}
                  data-testid="button-clearData"
                >
                  <Trash2 className="w-4 h-4" />
                  {clearDataMutation.isPending ? "Cancellazione..." : "Cancella Tutti i Dati"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Questa azione cancellerà tutti gli ordini e le statistiche, ma manterrà il menù.
                    <br />
                    <strong>Questa operazione non può essere annullata.</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={() => clearDataMutation.mutate()} className="bg-red-600 hover:bg-red-700">
                    Cancella Tutto
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-gray-500 mt-2">
              Cancella tutti gli ordini e le statistiche mantenendo solo il menù
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white rounded-xl shadow-sm border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-secondary bg-opacity-10 p-3 rounded-full">
                <Euro className="text-secondary text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Incasso Totale</p>
                <p className="text-2xl font-bold text-secondary" data-testid="text-totalRevenue">
                  {settings.currencySymbol}{stats.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                <Receipt className="text-primary text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ordini Totali</p>
                <p className="text-2xl font-bold text-primary" data-testid="text-totalOrders">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dish Sales */}
      <Card className="bg-white rounded-xl shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="text-primary mr-3" />
            Vendite per Piatto - Oggi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Piatto</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">Quantità</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">Ricavo</th>
                </tr>
              </thead>
              <tbody>
                {stats.dishSales.map((sale) => (
                  <tr key={sale.dish.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{sale.dish.name}</td>
                    <td className="py-3 px-2 text-right font-semibold">{sale.quantity}</td>
                    <td className="py-3 px-2 text-right text-secondary font-semibold">
                      {settings.currencySymbol}{sale.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.dishSales.length === 0 && (
              <div className="text-center text-gray-500 py-8">Nessuna vendita oggi</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Banknote className="text-secondary mr-2" />
              Metodi di Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium flex items-center">
                  <Banknote className="w-4 h-4 mr-2" />
                  Contanti
                </span>
                <span className="text-secondary font-bold">
                  {settings.currencySymbol}{stats.paymentStats.cash.amount.toFixed(2)} ({stats.paymentStats.cash.percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  POS
                </span>
                <span className="text-secondary font-bold">
                  {settings.currencySymbol}{stats.paymentStats.pos.amount.toFixed(2)} ({stats.paymentStats.pos.percentage.toFixed(0)}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="text-primary mr-2" />
              Riepilogo Oggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Ordine Medio</span>
                <span className="text-primary font-bold">
                  {settings.currencySymbol}{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Piatti Venduti</span>
                <span className="text-primary font-bold">
                  {stats.dishSales.reduce((sum, sale) => sum + sale.quantity, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
