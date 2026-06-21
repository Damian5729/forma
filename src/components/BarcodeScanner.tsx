"use client";

import { useRef, useState, useEffect } from "react";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"starting" | "scanning" | "found" | "error">("starting");
  const [error, setError] = useState("");
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus("scanning");
        startScanning();
      }
    } catch {
      setError("Kamera-Zugriff verweigert. Bitte in den Einstellungen erlauben.");
      setStatus("error");
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const startScanning = () => {
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx || video.readyState < 2) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Use BarcodeDetector API (Chrome/Edge/Android)
      if ("BarcodeDetector" in window) {
        try {
          const detector = new (window as unknown as { BarcodeDetector: new (opts: object) => { detect: (img: HTMLCanvasElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector({
            formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39"],
          });
          const barcodes = await detector.detect(canvas);
          if (barcodes.length > 0) {
            clearInterval(intervalRef.current!);
            await lookupBarcode(barcodes[0].rawValue);
          }
        } catch {
          // BarcodeDetector not available
        }
      }
    }, 500);
  };

  const lookupBarcode = async (barcode: string) => {
    setStatus("found");
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
          name: p.product_name ?? p.product_name_de ?? "Produkt",
          brand: p.brands?.split(",")[0]?.trim() ?? "",
          calories: Math.round(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? 0),
          protein: Math.round((n["proteins_100g"] ?? 0) * 10) / 10,
          carbs: Math.round((n["carbohydrates_100g"] ?? 0) * 10) / 10,
          fat: Math.round((n["fat_100g"] ?? 0) * 10) / 10,
        });
        stopCamera();
        onClose();
      } else {
        setError(`Barcode ${barcode} nicht gefunden. Manuell suchen.`);
        setStatus("error");
      }
    } catch {
      setError("Fehler beim Suchen. Bitte nochmal versuchen.");
      setStatus("error");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#000", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <p style={{ fontSize: "15px", fontWeight: 500, color: "#fff" }}>Barcode scannen</p>
        <button onClick={() => { stopCamera(); onClose(); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: "32px", height: "32px", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          ×
        </button>
      </div>

      {/* Camera view */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} playsInline muted />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Viewfinder overlay */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ width: "260px", height: "160px", position: "relative" }}>
            {/* Corner markers */}
            {[["0,0", "top", "left"], ["0,auto", "bottom", "left"], ["auto,0", "top", "right"], ["auto,auto", "bottom", "right"]].map(([, v, h], i) => (
              <div key={i} style={{ position: "absolute", [v]: 0, [h]: 0, width: "24px", height: "24px", borderTop: v === "top" ? "3px solid #1D9E75" : "none", borderBottom: v === "bottom" ? "3px solid #1D9E75" : "none", borderLeft: h === "left" ? "3px solid #1D9E75" : "none", borderRight: h === "right" ? "3px solid #1D9E75" : "none" }} />
            ))}
            {/* Scan line */}
            {status === "scanning" && (
              <div style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "rgba(29,158,117,0.8)", top: "50%", animation: "none" }} />
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ padding: "20px", background: "rgba(0,0,0,0.8)", textAlign: "center" }}>
        {status === "starting" && <p style={{ color: "#888", fontSize: "14px" }}>Kamera wird gestartet…</p>}
        {status === "scanning" && <p style={{ color: "var(--accent-light)", fontSize: "14px" }}>Halte den Barcode in den Rahmen</p>}
        {status === "found" && <p style={{ color: "var(--accent-light)", fontSize: "14px" }}>Barcode erkannt — suche Produkt…</p>}
        {status === "error" && (
          <div>
            <p style={{ color: "#E24B4A", fontSize: "14px", marginBottom: "10px" }}>{error}</p>
            <button onClick={() => { setStatus("starting"); setError(""); startCamera(); }} style={{ padding: "8px 16px", background: "var(--accent)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", cursor: "pointer" }}>
              Nochmal versuchen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
