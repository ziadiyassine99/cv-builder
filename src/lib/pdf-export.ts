import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export async function exportToPdf(
  element: HTMLElement,
  filename: string = "cv.pdf"
): Promise<void> {
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const SCALE = 2;

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.width = "210mm";
  clone.style.height = "297mm";
  clone.style.overflow = "hidden";
  clone.style.transform = "none";
  clone.style.margin = "0";
  clone.style.padding = "0";
  document.body.appendChild(clone);

  await new Promise((r) => setTimeout(r, 100));

  const renderWidth = clone.offsetWidth;
  const renderHeight = clone.offsetHeight;

  try {
    const canvas = await html2canvas(clone, {
      scale: SCALE,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: renderWidth,
      height: renderHeight,
      windowWidth: renderWidth,
      windowHeight: renderHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    pdf.addImage(imgData, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
    pdf.save(filename);
  } finally {
    document.body.removeChild(clone);
  }
}
