import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { updateElement, deleteElement, reorderElement, saveState } from "@/store/editorSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const fontFamilies = ["Inter", "Roboto", "Open Sans", "Lato", "Poppins", "Montserrat"];

export function PropertiesPanel() {
  const dispatch = useDispatch();
  const { selectedElementId, elements } = useSelector((state: RootState) => state.editor);
  
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-editor-border flex flex-col" data-testid="properties-panel">
        <div className="p-4 border-b border-editor-border">
          <h3 className="text-sm font-medium text-gray-800">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-500">Select an element to edit properties</p>
        </div>
      </div>
    );
  }

  const handleUpdateElement = (updates: any) => {
    dispatch(updateElement({ id: selectedElementId!, updates }));
    dispatch(saveState());
  };

  const handleDelete = () => {
    if (selectedElementId !== "background") {
      dispatch(deleteElement(selectedElementId!));
      dispatch(saveState());
    }
  };

  const toggleFontWeight = () => {
    const isBold = selectedElement.fontWeight === "bold";
    handleUpdateElement({ fontWeight: isBold ? "normal" : "bold" });
  };

  const toggleFontStyle = () => {
    const isItalic = selectedElement.fontStyle === "italic";
    handleUpdateElement({ fontStyle: isItalic ? "normal" : "italic" });
  };

  const toggleTextDecoration = () => {
    const hasUnderline = selectedElement.textDecoration === "underline";
    handleUpdateElement({ textDecoration: hasUnderline ? "none" : "underline" });
  };

  const setTextAlign = (align: "left" | "center" | "right") => {
    handleUpdateElement({ textAlign: align });
  };

  return (
    <div className="w-80 bg-white border-l border-editor-border flex flex-col" data-testid="properties-panel">
      <div className="p-4 border-b border-editor-border">
        <h3 className="text-sm font-medium text-gray-800">Properties</h3>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <div>
          <Label className="text-xs font-medium text-gray-600 mb-2 block">Element Type</Label>
          <div className="text-sm text-gray-800 capitalize">{selectedElement.type}</div>
        </div>
        
        <div>
          <Label className="text-xs font-medium text-gray-600 mb-2 block">Position & Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">X</Label>
              <Input
                type="number"
                className="text-xs"
                value={selectedElement.x}
                onChange={(e) => handleUpdateElement({ x: parseInt(e.target.value) || 0 })}
                data-testid="input-x"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Y</Label>
              <Input
                type="number"
                className="text-xs"
                value={selectedElement.y}
                onChange={(e) => handleUpdateElement({ y: parseInt(e.target.value) || 0 })}
                data-testid="input-y"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Width</Label>
              <Input
                type="number"
                className="text-xs"
                value={selectedElement.width}
                onChange={(e) => handleUpdateElement({ width: parseInt(e.target.value) || 0 })}
                data-testid="input-width"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Height</Label>
              <Input
                type="number"
                className="text-xs"
                value={selectedElement.height}
                onChange={(e) => handleUpdateElement({ height: parseInt(e.target.value) || 0 })}
                data-testid="input-height"
              />
            </div>
          </div>
        </div>

        {selectedElement.type === "text" && (
          <>
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-2 block">Text</Label>
              <Textarea
                className="text-sm resize-none"
                rows={3}
                value={selectedElement.text || ""}
                onChange={(e) => handleUpdateElement({ text: e.target.value })}
                data-testid="textarea-text"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600 mb-2 block">Typography</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Font Family</Label>
                  <Select
                    value={selectedElement.fontFamily || "Inter"}
                    onValueChange={(value) => handleUpdateElement({ fontFamily: value })}
                  >
                    <SelectTrigger className="text-xs" data-testid="select-font-family">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Size</Label>
                    <Input
                      type="number"
                      className="text-xs"
                      value={selectedElement.fontSize || 16}
                      onChange={(e) => handleUpdateElement({ fontSize: parseInt(e.target.value) || 16 })}
                      data-testid="input-font-size"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Line Height</Label>
                    <Input
                      type="number"
                      step="0.1"
                      className="text-xs"
                      value={selectedElement.lineHeight || 1.2}
                      onChange={(e) => handleUpdateElement({ lineHeight: parseFloat(e.target.value) || 1.2 })}
                      data-testid="input-line-height"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "p-1.5",
                      selectedElement.fontWeight === "bold" ? "bg-gray-100" : ""
                    )}
                    onClick={toggleFontWeight}
                    data-testid="button-bold"
                  >
                    <Bold className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "p-1.5",
                      selectedElement.fontStyle === "italic" ? "bg-gray-100" : ""
                    )}
                    onClick={toggleFontStyle}
                    data-testid="button-italic"
                  >
                    <Italic className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "p-1.5",
                      selectedElement.textDecoration === "underline" ? "bg-gray-100" : ""
                    )}
                    onClick={toggleTextDecoration}
                    data-testid="button-underline"
                  >
                    <Underline className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600 mb-2 block">Colors</Label>
              <div className="flex items-center space-x-2">
                <Label className="text-xs text-gray-500 min-w-12">Text</Label>
                <input
                  type="color"
                  className="w-8 h-8 border border-editor-border rounded cursor-pointer"
                  value={selectedElement.color || "#374151"}
                  onChange={(e) => handleUpdateElement({ color: e.target.value })}
                  data-testid="input-text-color"
                />
                <Input
                  type="text"
                  className="flex-1 text-xs"
                  value={selectedElement.color || "#374151"}
                  onChange={(e) => handleUpdateElement({ color: e.target.value })}
                  data-testid="input-color-hex"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600 mb-2 block">Alignment</Label>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "p-1.5",
                    selectedElement.textAlign === "left" ? "bg-gray-100" : ""
                  )}
                  onClick={() => setTextAlign("left")}
                  data-testid="button-align-left"
                >
                  <AlignLeft className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "p-1.5",
                    selectedElement.textAlign === "center" ? "bg-gray-100" : ""
                  )}
                  onClick={() => setTextAlign("center")}
                  data-testid="button-align-center"
                >
                  <AlignCenter className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "p-1.5",
                    selectedElement.textAlign === "right" ? "bg-gray-100" : ""
                  )}
                  onClick={() => setTextAlign("right")}
                  data-testid="button-align-right"
                >
                  <AlignRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </>
        )}

        {(selectedElement.type === "rectangle" || selectedElement.type === "circle") && (
          <div>
            <Label className="text-xs font-medium text-gray-600 mb-2 block">Background Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                className="w-8 h-8 border border-editor-border rounded cursor-pointer"
                value={selectedElement.backgroundColor || "#0066ff"}
                onChange={(e) => handleUpdateElement({ backgroundColor: e.target.value })}
                data-testid="input-background-color"
              />
              <Input
                type="text"
                className="flex-1 text-xs"
                value={selectedElement.backgroundColor || "#0066ff"}
                onChange={(e) => handleUpdateElement({ backgroundColor: e.target.value })}
                data-testid="input-background-hex"
              />
            </div>
          </div>
        )}

        <Separator />

        <div>
          <Label className="text-xs font-medium text-gray-600 mb-2 block">Layer</Label>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => dispatch(reorderElement({ id: selectedElementId!, direction: "forward" }))}
              data-testid="button-bring-forward"
            >
              <ArrowUp className="w-3 h-3 mr-1" />
              Forward
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => dispatch(reorderElement({ id: selectedElementId!, direction: "backward" }))}
              data-testid="button-send-backward"
            >
              <ArrowDown className="w-3 h-3 mr-1" />
              Back
            </Button>
          </div>
        </div>

        {selectedElementId !== "background" && (
          <div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleDelete}
              data-testid="button-delete"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete Element
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
