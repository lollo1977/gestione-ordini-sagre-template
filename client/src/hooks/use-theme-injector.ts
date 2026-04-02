import { useEffect } from "react";
import { useAppSettings } from "./use-app-settings";

export function useThemeInjector() {
  const settings = useAppSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.primaryColor) {
      root.style.setProperty("--primary", settings.primaryColor);
      root.style.setProperty("--ring", settings.primaryColor);
    }
    if (settings.secondaryColor) {
      root.style.setProperty("--secondary", settings.secondaryColor);
    }
    if (settings.accentColor) {
      root.style.setProperty("--accent", settings.accentColor);
    }
  }, [settings.primaryColor, settings.secondaryColor, settings.accentColor]);
}
