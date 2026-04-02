import type { DailyStats, AppSettings } from "@shared/schema";
import { CONFIG } from "@shared/config";

type ExportSettings = Pick<AppSettings, "eventName" | "currencySymbol" | "locale">;

function getSettings(settings?: Partial<ExportSettings>): ExportSettings {
  return {
    eventName: settings?.eventName ?? CONFIG.eventName,
    currencySymbol: settings?.currencySymbol ?? CONFIG.currencySymbol,
    locale: settings?.locale ?? CONFIG.locale,
  };
}

export function generateWordDocument(stats: DailyStats, date: string, settings?: Partial<ExportSettings>): string {
  const s = getSettings(settings);
  return `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 REPORT GIORNALIERO - ${s.eventName}\\par
\\par
Data: ${date}\\par
\\par
{\\b RIEPILOGO GENERALE}\\par
• Incasso Totale: ${s.currencySymbol}${stats.totalRevenue.toFixed(2)}\\par
• Ordini Totali: ${stats.totalOrders}\\par
\\par
{\\b VENDITE PER PIATTO}\\par
${stats.dishSales.map(sale =>
  `• ${sale.dish.name}: ${sale.quantity} pz - ${s.currencySymbol}${sale.revenue.toFixed(2)}\\par`
).join('')}
\\par
{\\b METODI DI PAGAMENTO}\\par
• Contanti: ${s.currencySymbol}${stats.paymentStats.cash.amount.toFixed(2)} (${stats.paymentStats.cash.percentage.toFixed(1)}%)\\par
• POS: ${s.currencySymbol}${stats.paymentStats.pos.amount.toFixed(2)} (${stats.paymentStats.pos.percentage.toFixed(1)}%)\\par
\\par
Generato il: ${new Date().toLocaleString(s.locale)}\\par
}`;
}

export function generateExcelDocument(stats: DailyStats, date: string, settings?: Partial<ExportSettings>): string {
  const s = getSettings(settings);
  return `REPORT GIORNALIERO - ${s.eventName}
Data,${date}

RIEPILOGO GENERALE
Incasso Totale,${s.currencySymbol}${stats.totalRevenue.toFixed(2)}
Ordini Totali,${stats.totalOrders}

VENDITE PER PIATTO
Piatto,Quantità,Ricavo
${stats.dishSales.map(sale =>
  `"${sale.dish.name}",${sale.quantity},${s.currencySymbol}${sale.revenue.toFixed(2)}`
).join('\n')}

METODI DI PAGAMENTO
Metodo,Importo,Percentuale
Contanti,${s.currencySymbol}${stats.paymentStats.cash.amount.toFixed(2)},${stats.paymentStats.cash.percentage.toFixed(1)}%
POS,${s.currencySymbol}${stats.paymentStats.pos.amount.toFixed(2)},${stats.paymentStats.pos.percentage.toFixed(1)}%

Generato il,${new Date().toLocaleString(s.locale)}`;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Errore download file:', error);
    alert('Errore nel download del file. Riprova.');
  }
}

export function exportToWord(stats: DailyStats, settings?: Partial<ExportSettings>) {
  try {
    const s = getSettings(settings);
    const date = new Date().toLocaleDateString(s.locale);
    const content = generateWordDocument(stats, date, s);
    const filename = `report_sagra_${new Date().toISOString().split('T')[0]}.rtf`;
    downloadFile(content, filename, 'application/rtf');
  } catch (error) {
    console.error('Errore esportazione Word:', error);
    alert('Errore nell\'esportazione Word. Riprova.');
  }
}

export function exportToExcel(stats: DailyStats, settings?: Partial<ExportSettings>) {
  try {
    const s = getSettings(settings);
    const date = new Date().toLocaleDateString(s.locale);
    const content = generateExcelDocument(stats, date, s);
    const filename = `report_sagra_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(content, filename, 'text/csv');
  } catch (error) {
    console.error('Errore esportazione Excel:', error);
    alert('Errore nell\'esportazione Excel. Riprova.');
  }
}
