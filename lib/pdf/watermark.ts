// Dynamic PDF Watermarking Engine for Institutional Documents
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import crypto from 'crypto';

export interface WatermarkOptions {
  userEmail: string;
  ipAddress: string;
  timestamp?: string;
  trackingId?: string;
  title?: string;
}

/**
 * Creates a sample base confidential PDF if an existing binary is not supplied.
 */
export async function createBaseSamplePdf(title: string, category: string, summary: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Top header bar
  page.drawRectangle({
    x: 40,
    y: height - 80,
    width: width - 80,
    height: 40,
    color: rgb(0.06, 0.09, 0.16), // Navy
  });

  page.drawText('KING & MEYER | STRATEGIC CAPITAL PLATFORM', {
    x: 55,
    y: height - 65,
    size: 11,
    font: fontBold,
    color: rgb(0.85, 0.7, 0.38), // Gold
  });

  page.drawText('CONFIDENTIAL LP VAULT ASSET', {
    x: width - 240,
    y: height - 65,
    size: 9,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // Title
  page.drawText(title, {
    x: 40,
    y: height - 130,
    size: 20,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  // Category Tag
  page.drawText(`Classification: ${category.replace(/_/g, ' ')}`, {
    x: 40,
    y: height - 150,
    size: 10,
    font: fontOblique,
    color: rgb(0.55, 0.45, 0.25),
  });

  // Divider
  page.drawLine({
    start: { x: 40, y: height - 165 },
    end: { x: width - 40, y: height - 165 },
    thickness: 1,
    color: rgb(0.85, 0.7, 0.38),
  });

  // Executive Abstract
  page.drawText('EXECUTIVE SUMMARY & MANDATE', {
    x: 40,
    y: height - 200,
    size: 12,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  const lines = [
    summary,
    '',
    'This document contains proprietary structural and financial data prepared exclusively',
    'for accredited allocators and verified Institutional Partners under executed non-disclosure agreements.',
    '',
    'Key Pillars of Verification:',
    '• Rigorous mathematical downside tail-risk containment (99.5% VaR parameterisation).',
    '• Systematic balance-sheet compounding via hard physical asset entitlement and operational technology.',
    '• Strict jurisdictional isolation and institutional-grade custody protocols.',
    '',
    'All figures, projections, and architectural specifications are subject to quarterly independent audit.'
  ];

  let currentY = height - 225;
  for (const line of lines) {
    if (line.startsWith('•')) {
      page.drawText(line, {
        x: 55,
        y: currentY,
        size: 10,
        font: fontRegular,
        color: rgb(0.2, 0.25, 0.3),
      });
    } else if (line.startsWith('This document')) {
      page.drawText(line, {
        x: 40,
        y: currentY,
        size: 9.5,
        font: fontOblique,
        color: rgb(0.4, 0.45, 0.5),
      });
    } else {
      page.drawText(line, {
        x: 40,
        y: currentY,
        size: 10,
        font: fontRegular,
        color: rgb(0.2, 0.25, 0.3),
      });
    }
    currentY -= 18;
  }

  // Footer Disclaimer
  page.drawLine({
    start: { x: 40, y: 70 },
    end: { x: width - 40, y: 70 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });

  page.drawText('STRICTLY PRIVATE & CONFIDENTIAL - REPRODUCTION OR DISSEMINATION IS STRICTLY PROHIBITED', {
    x: 40,
    y: 55,
    size: 7.5,
    font: fontBold,
    color: rgb(0.5, 0.5, 0.5),
  });

  return await pdfDoc.save();
}

/**
 * Dynamically stamps an existing or generated PDF with recipient metadata, IP, and UTC timestamp
 */
export async function stampDynamicWatermark(
  pdfBytes: Uint8Array,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const timestamp = options.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  const trackingId = options.trackingId || crypto.randomBytes(6).toString('hex').toUpperCase();

  const watermarkLine1 = `LICENSED TO: ${options.userEmail.toUpperCase()}`;
  const watermarkLine2 = `IP: ${options.ipAddress} | TIME: ${timestamp} | REF: ${trackingId}`;
  const watermarkLine3 = `RESTRICTED INSTITUTIONAL CIRCULATION ONLY`;

  for (const page of pages) {
    const { width, height } = page.getSize();

    // 1. Center Diagonal Watermark (Opacity 0.12)
    page.drawText(watermarkLine1, {
      x: width * 0.15,
      y: height * 0.45,
      size: 14,
      font: fontBold,
      color: rgb(0.8, 0.1, 0.1),
      opacity: 0.15,
      rotate: degrees(35),
    });

    page.drawText(watermarkLine2, {
      x: width * 0.13,
      y: height * 0.41,
      size: 11,
      font: fontRegular,
      color: rgb(0.8, 0.1, 0.1),
      opacity: 0.15,
      rotate: degrees(35),
    });

    page.drawText(watermarkLine3, {
      x: width * 0.18,
      y: height * 0.37,
      size: 12,
      font: fontBold,
      color: rgb(0.8, 0.1, 0.1),
      opacity: 0.15,
      rotate: degrees(35),
    });

    // 2. Top Header Security Banner
    page.drawRectangle({
      x: 40,
      y: height - 30,
      width: width - 80,
      height: 18,
      color: rgb(0.96, 0.94, 0.9),
      borderColor: rgb(0.85, 0.7, 0.38),
      borderWidth: 0.5,
    });

    page.drawText(`SECURE VAULT AUDIT COPY — LICENSED TO ${options.userEmail} [${options.ipAddress}]`, {
      x: 48,
      y: height - 23,
      size: 7.5,
      font: fontBold,
      color: rgb(0.55, 0.45, 0.2),
    });

    page.drawText(timestamp, {
      x: width - 180,
      y: height - 23,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.55, 0.45, 0.2),
    });
  }

  return await pdfDoc.save();
}
