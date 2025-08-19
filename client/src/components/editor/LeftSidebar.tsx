"use client"

import type React from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { selectTool, selectElement, addElement, toggleIconLibrary, saveState } from "@/store/editorSlice"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MousePointer, Type, Square, Circle, Image, Stamp, Eye, GripVertical } from "lucide-react"
import type { CanvasElement } from "@/types/editor"

const TOOLS = [
  { id: "select", label: "Select", icon: MousePointer },
  { id: "text", label: "Text", icon: Type },
  { id: "rectangle", label: "Rectangle", icon: Square },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "image", label: "Image", icon: Image },
  { id: "icons", label: "Stamp", icon: Stamp },
] as const

const ELEMENT_ICONS = {
  text: Type,
  image: Image,
  rectangle: Square,
  circle: Circle,
  background: Square,
} as const

export function LeftSidebar() {
  const dispatch = useDispatch()
  const { selectedTool, elements, selectedElementId } = useSelector((state: RootState) => state.editor)

  const createNewElement = (type: string): CanvasElement => {
    const baseElement = {
      id: `${type}-${Date.now()}`,
      x: 100,
      y: 100,
      zIndex: elements.length,
    }

    const elementConfigs = {
      text: {
        type: "text" as const,
        width: 200,
        height: 40,
        text: "New Text",
        fontSize: 16,
        fontFamily: "Inter",
        color: "#374151",
        textAlign: "left" as const,
      },
      rectangle: {
        type: "rectangle" as const,
        width: 100,
        height: 60,
        backgroundColor: "#0066ff",
      },
      circle: {
        type: "circle" as const,
        width: 80,
        height: 80,
        backgroundColor: "#0066ff",
      },
    }

    return { ...baseElement, ...elementConfigs[type as keyof typeof elementConfigs] } as CanvasElement
  }

  const handleToolSelect = (toolId: string) => {
    dispatch(selectTool(toolId))

    if (toolId === "icons") {
      dispatch(toggleIconLibrary(true))
    } else if (toolId === "image") {
      document.getElementById("image-upload")?.click()
    } else if (["text", "rectangle", "circle"].includes(toolId)) {
      const newElement = createNewElement(toolId)
      dispatch(addElement(newElement))
      dispatch(selectElement(newElement.id))
      dispatch(saveState())
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      const img = window.document.createElement("img")

      img.onload = () => {
        const MAX_SIZE = 200
        let { naturalWidth: width, naturalHeight: height } = img
        
        if (width > MAX_SIZE || height > MAX_SIZE) {
          const aspectRatio = width / height
          if (aspectRatio > 1) {
            width = MAX_SIZE
            height = MAX_SIZE / aspectRatio
          } else {
            height = MAX_SIZE
            width = MAX_SIZE * aspectRatio
          }
        }

        const newImageElement: CanvasElement = {
          id: `image-${Date.now()}`,
          type: "image",
          x: 100,
          y: 100,
          width: Math.round(width),
          height: Math.round(height),
          zIndex: elements.length + 1,
          imageUrl,
        }

        dispatch(addElement(newImageElement))
        dispatch(selectElement(newImageElement.id))
        dispatch(saveState())
      }
      
      img.src = imageUrl
    }
    
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  const getElementIcon = (type: string) => {
    const IconComponent = ELEMENT_ICONS[type as keyof typeof ELEMENT_ICONS] || Square
    return <IconComponent className="w-3 h-3" />
  }

  const getElementDisplayName = (element: CanvasElement) => {
    if (element.text) {
      return element.text.length > 15 ? `${element.text.substring(0, 15)}...` : element.text
    }
    return element.id
  }

  return (
    <div className="w-64 bg-editor-dark text-white flex flex-col border-r border-gray-300">
      {/* Tools Section */}
      <div className="p-4 border-b border-editor-gray">
        <h3 className="text-sm font-medium mb-3 text-gray-200">Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          {TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <Button
                key={tool.id}
                variant="ghost"
                className={cn(
                  "p-3 h-auto flex-col gap-1 text-white hover:bg-editor-gray transition-colors",
                  selectedTool === tool.id && "bg-editor-gray"
                )}
                onClick={() => handleToolSelect(tool.id)}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{tool.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Layers Section */}
      <div className="flex-1 p-4">
        <h3 className="text-sm font-medium mb-3 text-gray-200">Layers</h3>
        <div className="space-y-1">
          {elements
            .slice()
            .sort((a, b) => b.zIndex - a.zIndex)
            .map((element) => (
              <div
                key={element.id}
                className={cn(
                  "flex items-center p-2 rounded cursor-pointer transition-colors",
                  element.id === selectedElementId 
                    ? "bg-editor-accent bg-opacity-20" 
                    : "hover:bg-editor-gray"
                )}
                onClick={() => dispatch(selectElement(element.id))}
              >
                <Eye className="w-3 h-3 text-gray-400 mr-2" />
                <div className="text-gray-400 mr-2">
                  {getElementIcon(element.type)}
                </div>
                <span className="text-xs flex-1" title={element.text || element.id}>
                  {getElementDisplayName(element)}
                </span>
                <GripVertical className="w-3 h-3 text-gray-500" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}