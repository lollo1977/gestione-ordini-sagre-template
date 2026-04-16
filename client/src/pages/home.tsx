import { useState } from "react";
import { Utensils, Receipt, List, BarChart3, Settings, Info, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderForm from "@/components/order-form";
import ActiveOrders from "@/components/active-orders";
import MenuManagement from "@/components/menu-management";
import Reports from "@/components/reports";
import Analytics from "@/components/analytics";
import SettingsPage from "@/components/settings";
import Credits from "@/components/credits";
import { useLicense } from "@/hooks/use-license";
import { useAppSettings } from "@/hooks/use-app-settings";

type TabType = "ordini" | "menu" | "report" | "analisi" | "impostazioni" | "info";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("ordini");
  const { isPro } = useLicense();
  const settings = useAppSettings();

  const tabs = [
    { id: "ordini" as const, label: "Ordini", icon: Receipt },
    { id: "menu" as const, label: "Menù", icon: List },
    { id: "report" as const, label: "Report", icon: BarChart3 },
    { id: "analisi" as const, label: "Analisi", icon: TrendingUp },
    { id: "impostazioni" as const, label: "Impostazioni", icon: Settings },
    { id: "info" as const, label: "Info", icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Utensils className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                {settings.appTitle || "Gestione Ordini"}
              </h1>
            </div>
            <nav className="flex space-x-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id)}
                    data-testid={`tab-${tab.id}`}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "ordini" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderForm />
            <ActiveOrders />
          </div>
        )}
        {activeTab === "menu" && <MenuManagement />}
        {activeTab === "report" && <Reports />}
        {activeTab === "analisi" && <Analytics />}
        {activeTab === "impostazioni" && <SettingsPage />}
        {activeTab === "info" && <Credits />}
      </main>

      {/* Luna Wolfie footer — visible only in Free version */}
      {!isPro && (
        <footer
          className="no-print bg-gray-800 text-gray-300 text-center py-2 text-xs tracking-wide select-none"
          data-testid="banner-lunaWolfie"
        >
          Software distribuito da{" "}
          <span className="font-semibold text-white">Luna Wolfie</span>
          {" "}— Versione Free per No-Profit
        </footer>
      )}
    </div>
  );
}
