import ReactCodeMirror from "@uiw/react-codemirror";
import { ResizablePanel } from "../ui/resizable";
import { DiagramErrorAlert } from "./diagram-error-alert";
import {
  TransformComponent,
  TransformWrapper,
  ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";
import { Ref } from "react";

interface codeEditorProps {
  markdown: string;
  onChange: (value: string) => void;
  error: string;
}

interface diagramProps {
  wrapperRef: Ref<ReactZoomPanPinchContentRef>;
  diagramContainerRef: Ref<HTMLDivElement>;
}

export function CodeEditorPanel({
  markdown,
  onChange,
  error,
}: codeEditorProps) {
  return (
    <ResizablePanel className="relative max-h-full w-svw md:w-full">
      <ReactCodeMirror
        value={markdown}
        onChange={onChange}
        height="100%"
        className="h-full w-full overflow-x-auto"
        extensions={[]}
      />

      {error && (
        <div className="absolute bottom-1 w-full">
          <DiagramErrorAlert error={error} />
        </div>
      )}
    </ResizablePanel>
  );
}

export function DiagramPanel({
  wrapperRef,
  diagramContainerRef,
}: diagramProps) {
  return (
    <ResizablePanel className="">
      <TransformWrapper limitToBounds={false} centerOnInit ref={wrapperRef}>
        <TransformComponent wrapperStyle={{ height: "100%", width: "100%" }}>
          <div className="h-full w-full" ref={diagramContainerRef}></div>
        </TransformComponent>
      </TransformWrapper>
    </ResizablePanel>
  );
}
