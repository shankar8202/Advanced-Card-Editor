import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setZoomLevel, undo, redo } from "@/store/editorSlice";
import { Button } from "@/components/ui/button";
import { exportToPNG } from "@/lib/export";
import { Plus, FolderOpen, Save, Minus, Undo, Redo, Download } from "lucide-react";

export function Toolbar() {
  const dispatch = useDispatch();
  const { zoomLevel } = useSelector((state: RootState) => state.editor);

  const handleZoomIn = () => {
    dispatch(setZoomLevel(zoomLevel + 25));
  };

  const handleZoomOut = () => {
    dispatch(setZoomLevel(zoomLevel - 25));
  };

  const handleExport = async () => {
    try {
      await exportToPNG();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="bg-white border-b border-editor-border px-4 py-2 flex items-center justify-between shadow-sm" data-testid="top-toolbar">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-gray-800">Business Card Designer</h1>
        <div className="flex items-center space-x-2">
          <Button size="sm" className="text-xs" data-testid="button-new">
            <Plus className="w-3 h-3 mr-1" />
            New
          </Button>
          <Button variant="outline" size="sm" className="text-xs" data-testid="button-open">
            <FolderOpen className="w-3 h-3 mr-1" />
            Open
          </Button>
          <Button variant="outline" size="sm" className="text-xs" data-testid="button-save">
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 25}
            data-testid="button-zoom-out"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-xs text-gray-600 min-w-12 text-center" data-testid="text-zoom-level">
            {zoomLevel}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 400}
            data-testid="button-zoom-in"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(undo())}
            title="Undo (Ctrl+Z)"
            data-testid="button-undo"
          >
            <Undo className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(redo())}
            title="Redo (Ctrl+Y)"
            data-testid="button-redo"
          >
            <Redo className="w-3 h-3" />
          </Button>
        </div>
        
        <Button
          className="text-xs bg-green-600 hover:bg-green-700"
          size="sm"
          onClick={handleExport}
          data-testid="button-export"
        >
          <Download className="w-3 h-3 mr-1" />
          Export PNG
        </Button>
      </div>
    </div>
  );
}
