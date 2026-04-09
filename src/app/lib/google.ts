declare global {
  interface Window {
    google?: any;
  }
}

export function loadGoogleIdentityScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();

    const existing = document.querySelector<HTMLScriptElement>('script[data-google-identity="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Google identity script failed")));
      return;
    }

    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.dataset.googleIdentity = "true";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Google identity script failed"));
    document.head.appendChild(s);
  });
}

export interface GoogleButtonConfig {
  clientId: string;
  element: HTMLElement;
  callback: (resp: any) => void;
  width?: number;
  theme?: "outline" | "filled_blue" | "filled_black";
}

export function initializeAndRenderGoogleButton({ clientId, element, callback, width, theme }: GoogleButtonConfig) {
  if (!window.google?.accounts?.id) return;

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback,
    ux_mode: "popup",
  });

  // Calculate width: Google button max is 400px.
  // We try to get the container's width but cap it.
  const containerWidth = width || element.parentElement?.clientWidth || 340;
  const finalWidth = Math.min(Math.max(containerWidth, 200), 400);

  window.google.accounts.id.renderButton(element, {
    theme: theme || "outline",
    size: "large",
    width: finalWidth,
    shape: "rectangular",
    text: "continue_with",
    logo_alignment: "left",
  });
}



