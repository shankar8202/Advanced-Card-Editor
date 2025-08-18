import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { selectElement, moveElement, resizeElement, addElement, saveState } from "@/store/editorSlice";
import { Element } from "./Element";
import { useCallback, useRef, useEffect } from "react";
import { CanvasElement } from "@/types/editor";

export function Canvas() {
  const dispatch = useDispatch();
  const { elements, selectedElementId, selectedTool, zoomLevel } = useSelector((state: RootState) => state.editor);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(selectElement(null));
    }
  }, [dispatch]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    dispatch(selectElement(elementId));
    
    if (selectedTool === "select") {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
  }, [dispatch, selectedTool]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !selectedElementId) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    
    const selectedElement = elements.find((el) => el.id === selectedElementId);
    if (selectedElement) {
      const newX = Math.max(0, Math.min(600 - selectedElement.width, selectedElement.x + deltaX));
      const newY = Math.max(0, Math.min(350 - selectedElement.height, selectedElement.y + deltaY));
      
      dispatch(moveElement({ id: selectedElementId, x: newX, y: newY }));
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
  }, [selectedElementId, elements, dispatch]);

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      dispatch(saveState());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isDragging.current) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [handleMouseMove, handleMouseUp]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedElementId && selectedElementId !== "background") {
        dispatch(selectElement(null));
        dispatch(saveState());
      }

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        // dispatch(undo()); // Uncomment when implementing undo
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault();
        // dispatch(redo()); // Uncomment when implementing redo
      }

      if (selectedElementId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const selectedElement = elements.find((el) => el.id === selectedElementId);
        
        if (selectedElement) {
          let newX = selectedElement.x;
          let newY = selectedElement.y;
          
          switch (e.key) {
            case "ArrowUp": newY = Math.max(0, newY - step); break;
            case "ArrowDown": newY = Math.min(350 - selectedElement.height, newY + step); break;
            case "ArrowLeft": newX = Math.max(0, newX - step); break;
            case "ArrowRight": newX = Math.min(600 - selectedElement.width, newX + step); break;
          }
          
          dispatch(moveElement({ id: selectedElementId, x: newX, y: newY }));
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, elements, dispatch]);

  return (
    <div className="flex-1 flex flex-col bg-gray-100" data-testid="canvas-workspace">
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="relative">
          <div
            ref={canvasRef}
            className="relative bg-white shadow-lg cursor-default"
            style={{ 
              width: "600px", 
              height: "350px",
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "center"
            }}
            onClick={handleCanvasClick}
            data-testid="canvas"
          >
            <div className="absolute inset-0 opacity-10" 
                 style={{
                   backgroundImage: "repeating-linear-gradient(0deg, #ccc, #ccc 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #ccc, #ccc 1px, transparent 1px, transparent 20px)"
                 }} />
            
            {[...elements]
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((element) => (
                <Element
                  key={element.id}
                  element={element}
                  isSelected={element.id === selectedElementId}
                  onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                />
              ))}
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            Business Card • 600 × 350px • {zoomLevel}%
          </div>
        </div>
      </div>
    </div>
  );
}
