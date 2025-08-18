import html2canvas from "html2canvas";

export async function exportToPNG() {
  const canvas = document.querySelector('[data-testid="canvas"]') as HTMLElement;
  if (!canvas) {
    throw new Error("Canvas not found");
  }

  try {
    // Hide selection indicators and handles
    const selectedElements = document.querySelectorAll('[data-selected="true"]');
    const handles = document.querySelectorAll('.absolute[class*="cursor-"]');
    const rotationHandles = document.querySelectorAll('.cursor-grab');
    
    // Temporarily hide selection UI
    selectedElements.forEach((el) => {
      (el as HTMLElement).style.border = "none";
      (el as HTMLElement).style.backgroundColor = "transparent";
    });
    
    handles.forEach((handle) => {
      (handle as HTMLElement).style.display = "none";
    });
    
    rotationHandles.forEach((handle) => {
      (handle as HTMLElement).style.display = "none";
    });

    // Hide grid overlay
    const gridOverlay = canvas.querySelector('.absolute.inset-0.opacity-10');
    if (gridOverlay) {
      (gridOverlay as HTMLElement).style.display = "none";
    }

    // Capture the canvas
    const canvasImage = await html2canvas(canvas, {
      backgroundColor: "#ffffff",
      width: 600,
      height: 350,
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
    });

    // Restore selection UI
    selectedElements.forEach((el) => {
      (el as HTMLElement).style.border = "2px dashed #0066ff";
      (el as HTMLElement).style.backgroundColor = "rgba(0, 102, 255, 0.1)";
    });
    
    handles.forEach((handle) => {
      (handle as HTMLElement).style.display = "";
    });
    
    rotationHandles.forEach((handle) => {
      (handle as HTMLElement).style.display = "";
    });

    // Restore grid overlay
    if (gridOverlay) {
      (gridOverlay as HTMLElement).style.display = "";
    }

    // Download the image
    const link = document.createElement("a");
    link.download = `business-card-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvasImage.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Export failed:", error);
    throw error;
  }
}
