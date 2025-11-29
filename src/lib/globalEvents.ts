// src/lib/globalEvents.ts
export const globalEvents = {
  emitCartUpdated() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event("cart:updated"));
  },

  onCartUpdated(handler: () => void) {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("cart:updated", handler);
    return () => window.removeEventListener("cart:updated", handler);
  },

  emitUserUpdated() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event("user:updated"));
  },

  onUserUpdated(handler: () => void) {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("user:updated", handler);
    return () => window.removeEventListener("user:updated", handler);
  },
};
