import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { toggleIconLibrary, addElement, selectElement, saveState } from "@/store/editorSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CanvasElement } from "@/types/editor";

const icons = [
  { name: "envelope", unicode: "✉" },
  { name: "phone", unicode: "📞" },
  { name: "globe", unicode: "🌐" },
  { name: "location", unicode: "📍" },
  { name: "linkedin", unicode: "💼" },
  { name: "twitter", unicode: "🐦" },
  { name: "star", unicode: "⭐" },
  { name: "heart", unicode: "❤" },
  { name: "check", unicode: "✓" },
  { name: "arrow", unicode: "→" },
  { name: "home", unicode: "🏠" },
  { name: "user", unicode: "👤" },
];

export function IconLibraryModal() {
  const dispatch = useDispatch();
  const { showIconLibrary, elements } = useSelector((state: RootState) => state.editor);

  const handleIconSelect = (icon: typeof icons[0]) => {
    const newIconElement: CanvasElement = {
      id: `icon-${Date.now()}`,
      type: "text",
      x: 100,
      y: 100,
      width: 40,
      height: 40,
      zIndex: elements.length,
      text: icon.unicode,
      fontSize: 24,
      fontFamily: "Arial",
      color: "#0066ff",
      textAlign: "center",
    };
    
    dispatch(addElement(newIconElement));
    dispatch(selectElement(newIconElement.id));
    dispatch(toggleIconLibrary(false));
    dispatch(saveState());
  };

  const handleClose = () => {
    dispatch(toggleIconLibrary(false));
  };

  return (
    <Dialog open={showIconLibrary} onOpenChange={handleClose}>
      <DialogContent className="w-96 max-h-96" data-testid="icon-library-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Select an Icon
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              data-testid="button-close-modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-6 gap-3 p-4">
          {icons.map((icon) => (
            <Button
              key={icon.name}
              variant="ghost"
              className="p-3 h-auto flex-col gap-1 hover:bg-gray-100 transition-colors"
              onClick={() => handleIconSelect(icon)}
              data-testid={`icon-${icon.name}`}
            >
              <span className="text-lg">{icon.unicode}</span>
              <span className="text-xs text-gray-600 capitalize">{icon.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
