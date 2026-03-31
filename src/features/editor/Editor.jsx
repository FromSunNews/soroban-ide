import React from "react";
import { getFileType, getLanguageFromName } from "./editorUtils";
import CodeEditor from "./CodeEditor";
import ImageViewer from "./ImageViewer";
import PdfViewer from "./PdfViewer";

/**
 * Editor orchestrator — routes to the appropriate viewer
 * based on file type (code, image, PDF).
 * Auto-detects language from file extension.
 */
const Editor = ({ fileId, filePath, content = "", onChange, onCursorChange }) => {
  const fileType = getFileType(filePath);
  // Auto-detect language from file name/extension
  const language = getLanguageFromName(filePath);

  if (fileType === "image") {
    return <ImageViewer filePath={filePath} content={content} />;
  }

  if (fileType === "pdf") {
    return <PdfViewer filePath={filePath} content={content} />;
  }

  return <CodeEditor fileId={fileId} filePath={filePath} content={content} language={language} onChange={onChange} onCursorChange={onCursorChange} />;
};

export default Editor;
