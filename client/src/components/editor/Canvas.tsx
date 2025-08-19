"use client"

import type React from "react"
import { useSelector, useDispatch } from "react-redux"
import { useCallback, useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react"
import type { RootState } from "@/store/store"
import {
  selectElement,
  moveElementRealtime,
  resizeElementRealtime,
  updateElementRealtime,
  saveState,
  deleteElement,
} from "@/store/editorSlice"
import { Element } from "./Element"
import type { CanvasElement } from "@/types/editor"
import { RotateCw, Trash2 } from "lucide-react"

interface DragState {
  type: "idle" | "dragging" | "resizing" | "rotating"
  resizeHandle?: string
  startCoords: { x: number; y: number }
  startElement: { x: number; y: number; width: number; height: number; rotation: number }
  center?: { x: number; y: number }
}

const INITIAL_DRAG_STATE: DragState = {
  type: "idle",
  startCoords: { x: 0, y: 0 },
  startElement: { x: 0, y: 0, width: 0, height: 0, rotation: 0 },
}

export const Canvas = forwardRef<HTMLDivElement>((props, ref) => {
  const dispatch = useDispatch()
  const { elements, selectedElementId, selectedTool, zoomLevel } = useSelector((state: RootState) => state.editor)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [dragState, setDragState] = useState<DragState>(INITIAL_DRAG_STATE)

  useImperativeHandle(ref, () => canvasRef.current!, [])

  const getCanvasCoordinates = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current) return { x: 0, y: 0 }

      const rect = canvasRef.current.getBoundingClientRect()
      const scale = zoomLevel / 100
      const actualWidth = 600 * scale
      const actualHeight = 350 * scale
      const offsetX = (rect.width - actualWidth) / 2
      const offsetY = (rect.height - actualHeight) / 2

      return {
        x: Math.max(0, Math.min(600, (clientX - rect.left - offsetX) / scale)),
        y: Math.max(0, Math.min(350, (clientY - rect.top - offsetY) / scale)),
      }
    },
    [zoomLevel],
  )

  const calculateAngle = useCallback((centerX: number, centerY: number, pointX: number, pointY: number) => {
    return (Math.atan2(pointY - centerY, pointX - centerX) * 180) / Math.PI
  }, [])

  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.preventDefault()
      e.stopPropagation()

      if (selectedTool !== "select") return

      dispatch(selectElement(elementId))
      const element = elements.find((el) => el.id === elementId)
      if (!element) return

      const coords = getCanvasCoordinates(e.clientX, e.clientY)
      const target = e.target as HTMLElement
      const resizeHandle = target.getAttribute("data-resize-handle")
      const rotateHandle = target.getAttribute("data-rotate-handle")

      if (rotateHandle) {
        setDragState({
          type: "rotating",
          startCoords: coords,
          startElement: {
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            rotation: element.rotation || 0,
          },
          center: { x: element.x + element.width / 2, y: element.y + element.height / 2 },
        })
      } else if (resizeHandle) {
        setDragState({
          type: "resizing",
          resizeHandle,
          startCoords: coords,
          startElement: {
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            rotation: element.rotation || 0,
          },
        })
      } else {
        setDragState({
          type: "dragging",
          startCoords: coords,
          startElement: {
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            rotation: element.rotation || 0,
          },
        })
      }
    },
    [dispatch, selectedTool, elements, getCanvasCoordinates],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragState.type === "idle" || !selectedElementId) return

      e.preventDefault()
      const coords = getCanvasCoordinates(e.clientX, e.clientY)
      const deltaX = coords.x - dragState.startCoords.x
      const deltaY = coords.y - dragState.startCoords.y

      if (dragState.type === "dragging") {
        const newX = Math.max(0, Math.min(600 - dragState.startElement.width, dragState.startElement.x + deltaX))
        const newY = Math.max(0, Math.min(350 - dragState.startElement.height, dragState.startElement.y + deltaY))
        dispatch(moveElementRealtime({ id: selectedElementId, x: newX, y: newY }))
      } else if (dragState.type === "rotating" && dragState.center) {
        const currentAngle = calculateAngle(dragState.center.x, dragState.center.y, coords.x, coords.y)
        const startAngle = calculateAngle(
          dragState.center.x,
          dragState.center.y,
          dragState.startCoords.x,
          dragState.startCoords.y,
        )
        const newRotation = (((dragState.startElement.rotation + currentAngle - startAngle) % 360) + 360) % 360
        dispatch(updateElementRealtime({ id: selectedElementId, updates: { rotation: newRotation } }))
      } else if (dragState.type === "resizing" && dragState.resizeHandle) {
        const minSize = 20
        let { x, y, width, height } = dragState.startElement

        switch (dragState.resizeHandle) {
          case "nw":
            x = Math.min(x + deltaX, x + width - minSize)
            y = Math.min(y + deltaY, y + height - minSize)
            width = Math.max(minSize, width - deltaX)
            height = Math.max(minSize, height - deltaY)
            break
          case "ne":
            y = Math.min(y + deltaY, y + height - minSize)
            width = Math.max(minSize, width + deltaX)
            height = Math.max(minSize, height - deltaY)
            break
          case "sw":
            x = Math.min(x + deltaX, x + width - minSize)
            width = Math.max(minSize, width - deltaX)
            height = Math.max(minSize, height + deltaY)
            break
          case "se":
            width = Math.max(minSize, width + deltaX)
            height = Math.max(minSize, height + deltaY)
            break
          case "n":
            y = Math.min(y + deltaY, y + height - minSize)
            height = Math.max(minSize, height - deltaY)
            break
          case "s":
            height = Math.max(minSize, height + deltaY)
            break
          case "w":
            x = Math.min(x + deltaX, x + width - minSize)
            width = Math.max(minSize, width - deltaX)
            break
          case "e":
            width = Math.max(minSize, width + deltaX)
            break
        }

        // Constrain to canvas bounds
        x = Math.max(0, Math.min(600 - width, x))
        y = Math.max(0, Math.min(350 - height, y))
        width = Math.min(width, 600 - x)
        height = Math.min(height, 350 - y)

        dispatch(moveElementRealtime({ id: selectedElementId, x, y }))
        dispatch(resizeElementRealtime({ id: selectedElementId, width, height }))
      }
    },
    [dragState, selectedElementId, dispatch, getCanvasCoordinates, calculateAngle],
  )

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      if (dragState.type !== "idle") {
        setDragState(INITIAL_DRAG_STATE)
        dispatch(saveState())
      }
    },
    [dragState.type, dispatch],
  )

  // Event listeners
  useEffect(() => {
    if (dragState.type === "idle") return

    const options = { passive: false }
    document.addEventListener("mousemove", handleMouseMove, options)
    document.addEventListener("mouseup", handleMouseUp, options)
    document.body.style.userSelect = "none"
    document.body.style.cursor =
      dragState.type === "dragging" ? "move" : dragState.type === "rotating" ? "grabbing" : "default"

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }
  }, [dragState.type, handleMouseMove, handleMouseUp])

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedElementId && selectedElementId !== "background") {
        dispatch(deleteElement(selectedElementId))
        dispatch(selectElement(null))
        return
      }

      if (!selectedElementId || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return

      e.preventDefault()
      const step = e.shiftKey ? 10 : 1
      const element = elements.find((el) => el.id === selectedElementId)
      if (!element) return

      let newX = element.x,
        newY = element.y

      switch (e.key) {
        case "ArrowUp":
          newY = Math.max(0, newY - step)
          break
        case "ArrowDown":
          newY = Math.min(350 - element.height, newY + step)
          break
        case "ArrowLeft":
          newX = Math.max(0, newX - step)
          break
        case "ArrowRight":
          newX = Math.min(600 - element.width, newX + step)
          break
      }

      dispatch(moveElementRealtime({ id: selectedElementId, x: newX, y: newY }))
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedElementId, elements, dispatch])

  const renderControls = (element: CanvasElement) => {
    if (element.id !== selectedElementId || selectedTool !== "select") return null

    const handles = [
      { id: "nw", x: -4, y: -4, cursor: "nw-resize" },
      { id: "ne", x: element.width - 4, y: -4, cursor: "ne-resize" },
      { id: "sw", x: -4, y: element.height - 4, cursor: "sw-resize" },
      { id: "se", x: element.width - 4, y: element.height - 4, cursor: "se-resize" },
      { id: "n", x: element.width / 2 - 4, y: -4, cursor: "n-resize" },
      { id: "s", x: element.width / 2 - 4, y: element.height - 4, cursor: "s-resize" },
      { id: "w", x: -4, y: element.height / 2 - 4, cursor: "w-resize" },
      { id: "e", x: element.width - 4, y: element.height / 2 - 4, cursor: "e-resize" },
    ]

    return (
      <>
   
        <div className="absolute  inset-0 border-2 border-dashed border-blue-500 pointer-events-none -m-0.5 z-[999]" />

   
        {handles.map((handle) => (
          <div
            key={handle.id}
            data-resize-handle={handle.id}
            className="absolute w-2 h-2 bg-red-500 border-2 border-white shadow-sm z-[10000]"
            style={{ left: handle.x, top: handle.y, cursor: handle.cursor }}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          />
        ))}

      
        <div
          data-rotate-handle="true"
          className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm z-[10001] flex items-center justify-center cursor-grab"
          style={{ left: element.width / 2 - 8, top: -24 }}
          onMouseDown={(e) => handleElementMouseDown(e, element.id)}
        >
          <RotateCw size={10} color="white" />
        </div>

      
        {element.id !== "background" && (
          <div
            className="absolute w-5 h-5 bg-red-500 border-2 border-white rounded-full shadow-sm z-[10001] flex items-center justify-center cursor-pointer"
            style={{ right: -12, top: -12 }}
            onClick={(e) => {
              e.stopPropagation()
              dispatch(deleteElement(element.id))
              dispatch(selectElement(null))
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Trash2 size={10} color="white" />
          </div>
        )}
      </>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100 ">
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="relative">
          <div
            ref={canvasRef}
            className="relative bg-white shadow-lg cursor-default canvas-container"
            style={{
              width: "600px",
              height: "350px",
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "center",
              backgroundImage:
                "repeating-linear-gradient(0deg, #ccc, #ccc 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #ccc, #ccc 1px, transparent 1px, transparent 20px)",
              backgroundSize: "20px 20px",
            }}
            onClick={(e) => e.target === e.currentTarget && dispatch(selectElement(null))}
          >
            {elements
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((element) => (
                <div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: element.x,
                    top: element.y,
                    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                    transformOrigin: "center",
                  }}
                >
                  <Element
                    element={element}
                    isSelected={element.id === selectedElementId}
                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                  />
                  {renderControls(element)}
                </div>
              ))}
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">Business Card • 600 × 350px • {zoomLevel}%</div>
        </div>
      </div>
    </div>
  )
})

Canvas.displayName = "Canvas"
