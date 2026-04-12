import React, { memo } from "react";

/**
 * Right-click context menu for sidebar file/folder operations.
 */
const ContextMenu = memo(({ contextMenu, canPaste, onCopy, onCut, onPaste, onRename, onDelete, onNewFile, onNewFolder, onClose }) => {
  if (!contextMenu) return null;

  // Check if the node is a dependency file/folder that should be protected
  const isDependencyNode = (nodeName, nodeType, nodePath) => {
    const dependencyFolders = ["target", "node_modules", "dist", "build", "vendor", "deps", "__pycache__", ".venv", "venv", "cache", "tmp", ".next", ".nuxt"];
    const dependencyFiles = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "Cargo.lock", "Pipfile.lock", "poetry.lock"];

    // Protect project root folder (empty path)
    if (nodeType === "folder" && (!nodePath || nodePath === "")) {
      return true;
    }

    if (nodeType === "folder") {
      return dependencyFolders.includes(nodeName);
    } else if (nodeType === "file") {
      // Protect essential config files
      if (dependencyFiles.includes(nodeName)) {
        return true;
      }
      // Check if file is inside a dependency folder
      return dependencyFolders.some((folder) => nodePath.includes(`/${folder}/`));
    }
    return false;
  };

  const isProtected = isDependencyNode(contextMenu.nodeName, contextMenu.nodeType, contextMenu.nodePath);

  return (
    <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }} onClick={onClose}>
      {contextMenu.nodeType === "folder" && (
        <>
          <div className="context-menu-item" onClick={onNewFile}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            New File
          </div>
          <div className="context-menu-item" onClick={onNewFolder}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
            New Folder
          </div>
          {(!isProtected || canPaste) && <div className="context-menu-divider" />}
        </>
      )}

      {/* Copy/Cut only for non-root nodes */}
      {!isProtected && (
        <>
          <div className="context-menu-item" onClick={onCopy}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </div>
          <div className="context-menu-item" onClick={onCut}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
            Cut
          </div>
        </>
      )}

      {/* Paste allowed even on root folder */}
      {canPaste && contextMenu.nodeType === "folder" && (
        <div className="context-menu-item" onClick={onPaste}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          Paste
        </div>
      )}

      {/* Rename/Delete hidden only for strictly protected items */}
      {!isProtected && (
        <>
          <div className="context-menu-divider" />
          <div className="context-menu-item" onClick={onRename}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Rename
          </div>
          <div className="context-menu-item delete" onClick={onDelete}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </div>
        </>
      )}
    </div>
  );
});

export default ContextMenu;
