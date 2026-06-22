"use client";

import { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";

interface ScanResult {
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Props {
  onResult: (result: ScanResult) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onResult, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"starting" | "scanning" | "found" | "error">("starting");
  const [error, setError] = useState("");
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    startScanner();
    return () => {
      controlsRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanner = async () => {
    if (!videoRef.current) return;
    setStatus("starting");
    setError("");

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      // Prefer back camera
      const deviceId = devices.find((d) =>
        d.label.toLowerCase().includes("back") ||
        d.label.toLowerCase().includes("rück") ||
        d.label.toLowerCase().includes("environment")
      )?.deviceId ?? devices[devices.length - 1]?.deviceId;

      const controls = await reader.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        async (result, err) => {
          if (result) {
            controls.stop();
            setStatus("found");
            await lookupBarcode(result.getText());
          } else if (err && !(err instanceof NotFoundException)) {
            // Only show real errors, not "not found yet" errors
            console.debug("Scan loop:", err);
          }
        }
      );

      controlsRef.current = controls;
      setStatus("scanning");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("Permission") || msg.includes("NotAllowed")) {
        setError("Kamera-Zugriff verweigert. Bitte in den Einstellungen erlauben.");
      } else if (msg.includes("NotFound") || msg.includes("Devices")) {
        setError("Keine Kamera gefunden.");
      } else {
        setError("Kamera konnte nicht gestartet werden: " + msg);
      }
      setStatus("error");
    }
  };

  const lookupBarcode = async (barcode: string) => {
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
        { headers: { "User-Agent": "Forma-App/1.0" } }
      );
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const p = data.product;
        const n = p.nutriments ?? {};
        onResult({
          name: p.product_name_de ?? p.product_name ?? "Produkt",
          brand: p.brands?.split(",")[0]?.trim() ?? "",
          calories: Math.round(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? 0),
          protein: Math.round((n["proteins_100g"] ?? 0) * 10) / 10,
          carbs: Math.round((n["carbohydrates_100g"] ?? 0) * 10) / 10,
          fat: Math.round((n["fat_100g"] ?? 0) * 10) / 10,
        });
        onClose();
      } else {
        setError(`Barcode ${barcode} nicht in Datenbank. Manuell eingeben.`);
        setStatus("error");
      }
    } catch {
      setError("Netzwerkfehler. Bitte nochmal versuchen.");
      setStatus("error");
    }
  };

  const handleClose = () => {
    controlsRef.current?.stop();
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#000", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <p style={{ fontSize: "15px", fontWeight: 500, color: "#fff" }}>Barcode scannen</p>
        <button onClick={handleClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: "32px", height: "32px", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          ×
        </button>
      </div>

      {/* Camera view */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} playsInline muted autoPlay />

        {/* Viewfinder overlay */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {/* Dark vignette around frame */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
          <div style={{ width: "270px", height: "170px", position: "relative", zIndex: 2 }}>
            {/* Clear window */}
            <div style={{ position: "absolute", inset: 0, background: "transparent", boxShadow: "0 0 0 2000px rgba(0,0,0,0.45)" }} />
            {/* Corner markers */}
            {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((corner) => (
              <div key={corner} style={{
                position: "absolute",
                top: corner.startsWith("top") ? 0 : "auto",
                bottom: corner.startsWith("bottom") ? 0 : "auto",
                left: corner.endsWith("left") ? 0 : "auto",
                right: corner.endsWith("right") ? 0 : "auto",
                width: "28px", height: "28px",
                borderTop: corner.startsWith("top") ? "3px solid #1D9E75" : "none",
                borderBottom: corner.startsWith("bottom") ? "3px solid #1D9E75" : "none",
                borderLeft: corner.endsWith("left") ? "3px solid #1D9E75" : "none",
                borderRight: corner.endsWith("right") ? "3px solid #1D9E75" : "none",
              }} />
            ))}
            {/* Scan line animation */}
            {status === "scanning" && (
              <div style={{
                position: "absolute", left: "4px", right: "4px", height: "2px",
                background: "linear-gradient(90deg, transparent, #1D9E75, transparent)",
                animation: "scanLine 2s ease-in-out infinite",
                top: "50%",
              }} />
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ padding: "24px 20px", background: "rgba(0,0,0,0.9)", textAlign: "center", minHeight: "90px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {status === "starting" && (
          <p style={{ color: "#888", fontSize: "14px" }}>Kamera wird gestartet…</p>
        )}
        {status === "scanning" && (
          <>
            <p style={{ color: "#5DCAA5", fontSize: "14px", marginBottom: "4px" }}>Barcode in den Rahmen halten</p>
            <p style={{ color: "#555", fontSize: "11px" }}>Funktioniert mit EAN-13, EAN-8, UPC-A/E, Code 128</p>
          </>
        )}
        {status === "found" && (
          <p style={{ color: "#5DCAA5", fontSize: "14px" }}>Barcode erkannt — Produkt wird gesucht…</p>
        )}
        {status === "error" && (
          <div>
            <p style={{ color: "#E24B4A", fontSize: "14px", marginBottom: "12px" }}>{error}</p>
            <button onClick={startScanner} style={{ padding: "8px 18px", background: "#1D9E75", border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", cursor: "pointer" }}>
              Nochmal versuchen
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 10%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
