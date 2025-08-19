"use client"

import html2canvas from "html2canvas"

export async function exportToPNG(canvasEl: HTMLElement | null) {
  if (!canvasEl) throw new Error("Canvas not found")


  const selectionBorders = canvasEl.querySelectorAll(".border-dashed.border-blue-500")
  const resizeHandles = canvasEl.querySelectorAll("[data-resize-handle]")
  const rotationHandles = canvasEl.querySelectorAll("[data-rotate-handle]")
  const deleteButtons = canvasEl.querySelectorAll(".bg-red-500")

 
  const elementsToHide = [
    ...Array.from(selectionBorders),
    ...Array.from(resizeHandles),
    ...Array.from(rotationHandles),
    ...Array.from(deleteButtons),
  ]

  elementsToHide.forEach((el) => {
    ;(el as HTMLElement).style.display = "none"
  })

  try {
    const canvasImage = await html2canvas(canvasEl, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      width: 600,
      height: 350,
      scrollX: 0,
      scrollY: 0,
    })

    // Download the image
    const link = document.createElement("a")
    link.download = `business-card-${new Date().toISOString().slice(0, 10)}.png`
    link.href = canvasImage.toDataURL("image/png")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    elementsToHide.forEach((el) => {
      ;(el as HTMLElement).style.display = ""
    })
  }
}
