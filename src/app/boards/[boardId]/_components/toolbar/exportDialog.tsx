import React, { useState } from "react";
import { Download } from "lucide-react";
import { Hint } from "@/components/hint";

interface ExportDialogProps {
  exportCanvas: (backgroundColor: string) => Promise<void>;
  currentScale: number;
}

type BackgroundType = "current" | "transparent" | "custom";

const ExportDialog: React.FC<ExportDialogProps> = ({ exportCanvas, currentScale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bgType, setBgType] = useState<BackgroundType>("current");
  const [customColor, setCustomColor] = useState("#ffffff");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let backgroundColor = "transparent";
      if (bgType === "current") {
        backgroundColor = "#e2e8f0";
      } else if (bgType === "custom") {
        backgroundColor = customColor;
      }

      await exportCanvas(backgroundColor);
      setIsOpen(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Hint label={"Export Canvas"} side={"right"} sideOffset={10}>
        <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-gray-100 rounded-md">
          <Download className="h-5 w-5" />
        </button>
      </Hint>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-[425px] mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Export Canvas</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-medium"
                >
                  ×
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-sm text-blue-800">
                  Current zoom: {Math.round(currentScale * 100)}%
                  <br />
                  Image will be exported at the current zoom level and position
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  {[
                    { value: "current", label: "Current Background" },
                    { value: "transparent", label: "Transparent" },
                    { value: "custom", label: "Custom Color" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={option.value}
                        name="background-type"
                        value={option.value}
                        checked={bgType === option.value}
                        onChange={(e) => setBgType(e.target.value as BackgroundType)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label htmlFor={option.value} className="text-sm">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>

                {bgType === "custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-16 h-8 p-1 rounded"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-24 px-2 py-1 border rounded"
                      placeholder="#ffffff"
                    />
                  </div>
                )}

                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? "Exporting..." : "Export PNG"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportDialog;
