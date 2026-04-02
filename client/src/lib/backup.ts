const LS_KEYS = [
  "luna_wolfie_is_pro",
  "luna_wolfie_licensed_event",
  "luna_wolfie_setup_complete",
];

export interface BackupFile {
  version: string;
  exportedAt: string;
  eventName: string;
  localStorage: Record<string, string>;
  settings: Record<string, unknown>;
  menu: Array<{ name: string; price: string; category: string }>;
}

export async function exportBackup(eventName: string): Promise<void> {
  const [settingsRes, dishesRes] = await Promise.all([
    fetch("/api/settings"),
    fetch("/api/dishes"),
  ]);
  const settings = await settingsRes.json();
  const menu = await dishesRes.json();

  const lsData: Record<string, string> = {};
  LS_KEYS.forEach((key) => {
    const val = localStorage.getItem(key);
    if (val !== null) lsData[key] = val;
  });

  const backup: BackupFile = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    eventName,
    localStorage: lsData,
    settings,
    menu,
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = eventName.replace(/[^\w]/g, "_").replace(/_+/g, "_").toLowerCase();
  a.download = `configurazione_luna_wolfie_${safeName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<void> {
  const text = await file.text();
  let backup: BackupFile;
  try {
    backup = JSON.parse(text) as BackupFile;
  } catch {
    throw new Error("Il file selezionato non è un JSON valido.");
  }

  if (!backup.version || !backup.settings) {
    throw new Error("File di backup non riconosciuto. Verifica che sia un backup Luna Wolfie.");
  }

  // Restore localStorage
  if (backup.localStorage && typeof backup.localStorage === "object") {
    Object.entries(backup.localStorage).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }

  // Restore settings
  await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backup.settings),
  });

  // Restore menu: delete existing, recreate from backup
  if (Array.isArray(backup.menu) && backup.menu.length > 0) {
    const existingRes = await fetch("/api/dishes");
    const existing: Array<{ id: string | number }> = await existingRes.json();
    await Promise.all(
      existing.map((d) => fetch(`/api/dishes/${d.id}`, { method: "DELETE" }))
    );
    for (const dish of backup.menu) {
      await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dish.name,
          price: dish.price,
          category: dish.category,
        }),
      });
    }
  }

  window.location.reload();
}
