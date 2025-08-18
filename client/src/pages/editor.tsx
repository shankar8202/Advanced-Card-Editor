import { Canvas } from "@/components/editor/Canvas";
import { Toolbar } from "@/components/editor/Toolbar";
import { LeftSidebar } from "@/components/editor/LeftSidebar";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { IconLibraryModal } from "@/components/editor/IconLibraryModal";

export default function Editor() {
  return (
    <div className="h-screen flex flex-col bg-editor-light" data-testid="design-editor">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />
        <Canvas />
        <PropertiesPanel />
      </div>
      <IconLibraryModal />
    </div>
  );
}
