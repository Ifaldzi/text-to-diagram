"use client";

import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ReactCodeMirror, {
  basicSetup,
  EditorState,
} from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { mermaid as mermaidLang } from "codemirror-lang-mermaid";
import { useIndexedDb } from "@/data/local/use-indexed-db";
import { useRouter, useSearchParams } from "next/navigation";
import { Diagram } from "@/data/models/diagram";
import { Stores } from "@/data/local/indexed-db";
import { Button } from "@/components/ui/button";
import { Save, Slash, Store, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateDiagramDialog } from "@/components/diagrams/create-diagram-dialog";
import { DiagramErrorAlert } from "@/components/diagrams/diagram-error-alert";
import {
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from "@codemirror/language";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SAVE_STATUS } from "@/constants/diagram-constant";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CodeEditorPanel,
  DiagramPanel,
} from "@/components/diagrams/diagram-panel";

const defaultDiagram = `graph LR
  A --- B
  B-->C[fa:fa-ban forbidden]
  B-->D(fa:fa-spinner);`;

export default function Home() {
  const [markdown, setMarkdown] = useState(defaultDiagram);
  const diagramContainer = useRef<HTMLDivElement>(null);
  const transformWrapper = useRef<ReactZoomPanPinchContentRef>(null);
  const { getDataByKey, updateData, insertData, isDbLoaded } = useIndexedDb();

  const searchParams = useSearchParams();
  const diagramId = searchParams.get("id");
  const isMobile = useIsMobile();

  const [diagramTitle, setDiagramTitle] = useState<string>("Untitled Diagram");
  const [diagram, setDiagram] = useState<Diagram>();
  // const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [folderTitle, setFolderTitle] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [diagramError, setDiagramError] = useState("");
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [autoSaveTimer, setAutoSaveTimer] = useState<
    NodeJS.Timeout | undefined
  >();

  const router = useRouter();

  mermaid.initialize({ startOnLoad: false });

  useEffect(() => {
    const renderDiagram = async () => {
      if (markdown) {
        try {
          if (await mermaid.parse(markdown, { suppressErrors: false })) {
            setDiagramError("");
            return mermaid.render("diagram", markdown);
          }

          return null;
        } catch (err: any) {
          setDiagramError(err.message);
        }
      } else {
        return null;
      }
    };

    setSaveStatus("");

    renderDiagram().then((diagram) => {
      if (diagram && diagramContainer.current) {
        diagramContainer.current.innerHTML = diagram.svg;
      } else if (markdown == "" && diagramContainer.current) {
        diagramContainer.current.innerHTML = "";
      }
    });

    if (isAutoSave) {
      handleAutoSave();
    }
  }, [markdown]);

  useEffect(() => {
    if (!diagramId) {
      setDefault();
    } else {
      setIsAutoSave(true);
    }

    if (diagramId && isDbLoaded) {
      getDiagram(diagramId);

      setTimeout(() => {
        if (transformWrapper.current) {
          const svgElement = diagramContainer.current?.querySelector("svg");
          const scale = svgElement
            ? svgElement.getBBox().width / svgElement.clientWidth
            : 1;

          transformWrapper.current.centerView(scale, 0);
        }
      }, 100);
    }
  }, [diagramId, isDbLoaded]);

  const getDiagram = (key: string) => {
    getDataByKey<Diagram>(Stores.Diagrams, key).then((diagram) => {
      if (diagram) {
        setMarkdown(diagram.content);
        setDiagramTitle(diagram.title);
        setDiagram(diagram);
        if (diagram.parentId) {
          getDataByKey<Diagram>(Stores.Diagrams, diagram.parentId).then(
            (parent) => {
              if (parent) {
                setFolderTitle(parent.title);
              }
            }
          );
        } else {
          setFolderTitle("");
        }
      }
    });
  };

  const handleSave = () => {
    if (!diagramId) {
      setCreateDialogOpen(true);
    } else if (diagramId && diagram) {
      const newDiagram = { ...diagram, content: markdown };
      setSaveStatus(SAVE_STATUS.SAVING);
      updateData(Stores.Diagrams, newDiagram).then(() =>
        setSaveStatus(SAVE_STATUS.SAVED)
      );
    }
  };

  const handleAutoSave = () => {
    clearTimeout(autoSaveTimer);

    const newTimer = setTimeout(() => {
      handleSave();
    }, 500);

    setAutoSaveTimer(newTimer);
  };

  const setDefault = () => {
    setMarkdown(defaultDiagram);
    setDiagramTitle("Untitled Diagram");
    setIsAutoSave(false);
  };

  const insertDiagram = (diagram: Diagram) => {
    diagram.content = markdown;
    insertData<Diagram>(diagram, Stores.Diagrams).then((newDiagram) => {
      router.push(`?id=${newDiagram.id}`);
    });
  };

  const exportDiagram = (format: "jpg" | "png" | "copy") => {
    const svgElement = diagramContainer.current?.querySelector("svg");
    if (svgElement) {
      const svg = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          const viewBox = svgElement.getBBox();
          canvas.width = viewBox.width;
          canvas.height = viewBox.height;
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          if (format === "copy") {
            canvas.toBlob((blob) => {
              if (blob) {
                navigator.clipboard.write([
                  new ClipboardItem({
                    [blob.type]: blob,
                  }),
                ]);
              }
            }, "image/png");
          } else {
            const dataURL = canvas.toDataURL(`image/${format}`);
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = `${diagramTitle}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        };
        img.crossOrigin = "anonymous";
        img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      }
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 justify-between shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList className="text-xs md:text-base">
                {folderTitle ? (
                  <>
                    <BreadcrumbItem className="md:block hidden">
                      <BreadcrumbPage className="">
                        {folderTitle}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="md:block hidden">
                      <Slash />
                    </BreadcrumbSeparator>
                  </>
                ) : (
                  ""
                )}
                <BreadcrumbItem className="block">
                  <BreadcrumbPage>{diagramTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Button
              size={isMobile ? "sm" : "default"}
              variant="ghost"
              onClick={handleSave}
            >
              <Save /> <span className="hidden md:block">Save</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-save"
                checked={isAutoSave}
                onCheckedChange={setIsAutoSave}
                disabled={!diagramId}
              />
              <Label htmlFor="auto-save" className="text-[0.5rem] md:text-base">
                Auto Save
              </Label>
            </div>
            <p className="text-xs md:text-base ml-2">{saveStatus}</p>
          </div>

          <div className="flex items-center gap-2 px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={isMobile ? "sm" : "default"}>
                  <Upload /> <span className="md:block hidden">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left" align="start" className="w-40">
                <DropdownMenuItem onClick={() => exportDiagram("jpg")}>
                  Export to jpg
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportDiagram("png")}>
                  Export to png
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportDiagram("copy")}>
                  Copy as Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="md:px-4 h-[calc(100svh-4rem)]">
          <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
            {isMobile ? (
              <DiagramPanel
                wrapperRef={transformWrapper}
                diagramContainerRef={diagramContainer}
              />
            ) : (
              <CodeEditorPanel
                markdown={markdown}
                onChange={setMarkdown}
                error={diagramError}
              />
            )}
            <ResizableHandle withHandle />
            {isMobile ? (
              <CodeEditorPanel
                markdown={markdown}
                onChange={setMarkdown}
                error={diagramError}
              />
            ) : (
              <DiagramPanel
                wrapperRef={transformWrapper}
                diagramContainerRef={diagramContainer}
              />
            )}
          </ResizablePanelGroup>
        </div>
      </SidebarInset>
      {!diagramId && (
        <CreateDiagramDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          insertData={insertDiagram}
        />
      )}
    </SidebarProvider>
  );
}
