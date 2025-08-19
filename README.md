A browser-based design editor (like a simplified Canva/Figma) that allows users to add, move, resize, rotate, align, and export elements inside a fixed-size canvas.
The project is built with React, Redux, and TypeScript, and supports exporting the final design as a PNG image.

-----Features

Add shapes (rectangles, circles, images, and text) to the canvas

Drag, resize, and rotate elements with handles

Multi-element selection with highlighting

Grid overlay for alignment

Undo/Redo with state history (Redux-powered)

Export final design to

Approach

1. Canvas Rendering

We use a fixed container (600x350px) to represent the business card.

Every element (rectangle, circle, text, image) is rendered inside this container as a positioned div.

2. Element Management

Actions include:

selectElement

moveElement

resizeElement

rotateElement

deleteElement

saveState (for undo/redo)

Selection & Handles

Selected elements get a dashed border with resize & rotate handles.

These handles are hidden automatically during export to avoid UI artifacts.

4. Grid Overlay

A semi-transparent grid overlay helps with alignment.

It is also hidden during export.

5. Export to PNG

Implemented with html2canvas:

Temporarily hides borders, selection, handles, and grid

Captures the DOM into a canvas

Restores hidden UI after export
