"use client";

import { QRCodeCanvas } from "qrcode.react";

export function QRCodeDisplay({ value }: { value: string }) {
  return (
    <div className="p-3 bg-white rounded-lg inline-block shadow-lg">
      <QRCodeCanvas value={value} size={150} level="H" fgColor="#000d1a" />
    </div>
  );
}
