import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { selectTool, selectElement, addElement, toggleIconLibrary, saveState } from "@/store/editorSlice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  MousePointer, 
  Type, 
  Square, 
  Circle, 
  Image, 
  Stamp, 
  Eye, 
  GripVertical
} from "lucide-react";
import { CanvasElement } from "@/types/editor";

const tools = [
  { id: "select", label: "Select", icon: MousePointer },
  { id: "text", label: "Text", icon: Type },
  { id: "rectangle", label: "Rectangle", icon: Square },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "image", label: "Image", icon: Image },
  { id: "icons", label: "Stamp", icon: Stamp },
];

export function LeftSidebar() {
  const dispatch = useDispatch();
  const { selectedTool, elements, selectedElementId } = useSelector((state: RootState) => state.editor);

  const handleToolSelect = (toolId: string) => {
    dispatch(selectTool(toolId));
    
    if (toolId === "icons") {
      dispatch(toggleIconLibrary(true));
    } else if (toolId === "text") {
      const newTextElement: CanvasElement = {
        id: `text-${Date.now()}`,
        type: "text",
        x: 100,
        y: 100,
        width: 200,
        height: 40,
        zIndex: elements.length,
        text: "New Text",
        fontSize: 16,
        fontFamily: "Inter",
        color: "#374151",
        textAlign: "left",
      };
      dispatch(addElement(newTextElement));
      dispatch(selectElement(newTextElement.id));
      dispatch(saveState());
    } else if (toolId === "rectangle") {
      const newRectElement: CanvasElement = {
        id: `rect-${Date.now()}`,
        type: "rectangle",
        x: 100,
        y: 100,
        width: 100,
        height: 60,
        zIndex: elements.length,
        backgroundColor: "#0066ff",
      };
      dispatch(addElement(newRectElement));
      dispatch(selectElement(newRectElement.id));
      dispatch(saveState());
    } else if (toolId === "circle") {
      const newCircleElement: CanvasElement = {
        id: `circle-${Date.now()}`,
        type: "circle",
        x: 100,
        y: 100,
        width: 80,
        height: 80,
        zIndex: elements.length,
        backgroundColor: "#0066ff",
      };
      dispatch(addElement(newCircleElement));
      dispatch(selectElement(newCircleElement.id));
      dispatch(saveState());
    }
  };

  const handleLayerSelect = (elementId: string) => {
    dispatch(selectElement(elementId));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const newImageElement: CanvasElement = {
          id: `image-${Date.now()}`,
          type: "image",
          x: 100,
          y: 100,
          width: 150,
          height: 150,
          zIndex: elements.length,
          imageUrl,
        };
        dispatch(addElement(newImageElement));
        dispatch(selectElement(newImageElement.id));
        dispatch(saveState());
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case "text": return <Type className="w-3 h-3" />;
      case "image": return <Image className="w-3 h-3" />;
      case "rectangle": return <Square className="w-3 h-3" />;
      case "circle": return <Circle className="w-3 h-3" />;
      case "background": return <Square className="w-3 h-3" />;
      default: return <Square className="w-3 h-3" />;
    }
  };

  return (
    <div className="w-64 bg-editor-dark text-white flex flex-col border-r border-gray-300" data-testid="left-sidebar">
      <div className="p-4 border-b border-editor-gray">
        <h3 className="text-sm font-medium mb-3 text-gray-200">Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant="ghost"
                className={cn(
                  "p-3 h-auto flex-col gap-1 text-white hover:bg-editor-gray transition-colors",
                  selectedTool === tool.id ? "bg-editor-gray" : ""
                )}
                onClick={() => handleToolSelect(tool.id)}
                data-testid={`tool-${tool.id}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{tool.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />

      <div className="flex-1 p-4">
        <h3 className="text-sm font-medium mb-3 text-gray-200">Layers</h3>
        <div className="space-y-1">
          {[...elements]
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
                onClick={() => handleLayerSelect(element.id)}
                data-testid={`layer-${element.id}`}
              >
                <Eye className="w-3 h-3 text-gray-400 mr-2" />
                <div className="text-gray-400 mr-2">
                  {getElementIcon(element.type)}
                </div>
                <span className="text-xs flex-1" title={element.text || element.id}>
                  {element.text ? 
                    (element.text.length > 15 ? element.text.substring(0, 15) + "..." : element.text) 
                    : element.id}
                </span>
                <GripVertical className="w-3 h-3 text-gray-500" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
