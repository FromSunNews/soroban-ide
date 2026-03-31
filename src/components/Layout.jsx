import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../features/sidebar/Sidebar";
import Tabs from "../features/tabs/Tabs";
import Editor from "../features/editor/Editor";
import Terminal from "../features/terminal/Terminal";
import { getLanguageFromName, getLanguageDisplayName } from "../features/editor/editorUtils";
import { useWorkspaceState, useTabManager } from "../features/workspace/workspaceHooks";
import { cloneNodeWithNewIds, collectContentsMap, addNodeToTree, moveNodeInTree } from "../features/workspace/workspaceUtils";

/**
 * Main Layout — the slim orchestrator.
 * Composes workspace state hooks with UI feature components.
 */
const Layout = () => {
  const workspace = useWorkspaceState();
  const tabManager = useTabManager(workspace.flattenedNodes);

  const [clipboardState, setClipboardState] = useState(null);
  const [cursorInfo, setCursorInfo] = useState({ lineNumber: 1, column: 1, selectedChars: 0 });
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showGithubClone, setShowGithubClone] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [cloneStatus, setCloneStatus] = useState(null);
  const createMenuRef = useRef(null);
  const setFileContentsRef = useRef(workspace.setFileContents);
  const previewTabIdRef = useRef(tabManager.previewTabId);
  const activeFileIdRef = useRef(tabManager.activeFileId);

  // Keep refs up to date
  useEffect(() => {
    setFileContentsRef.current = workspace.setFileContents;
  }, [workspace.setFileContents]);

  useEffect(() => {
    previewTabIdRef.current = tabManager.previewTabId;
  }, [tabManager.previewTabId]);

  useEffect(() => {
    activeFileIdRef.current = tabManager.activeFileId;
  }, [tabManager.activeFileId]);

  // Derived state
  const activeFile = tabManager.activeFileId ? workspace.flattenedNodes.get(tabManager.activeFileId) : null;
  const activeContent = tabManager.activeFileId ? workspace.fileContents[tabManager.activeFileId] : "";
  const language = activeFile ? getLanguageFromName(activeFile.name) : "rust";

  // Handle new item creation and open in tab
  const handleNewItem = useCallback(
    (type, name, parentId) => {
      const newId = workspace.addItem(type, name, parentId);
      if (newId && type === "file") {
        tabManager.openFile(newId);
      }
    },
    [workspace, tabManager],
  );

  // Handle delete with tab cleanup
  const handleDeleteItem = useCallback(
    (nodeId) => {
      const deletedFileIds = workspace.deleteItem(nodeId);
      deletedFileIds.forEach((fileId) => {
        if (tabManager.tabs.includes(fileId)) {
          tabManager.closeTab(fileId);
        }
      });
    },
    [workspace, tabManager],
  );

  // Handle editor content changes - auto-save to permanent state
  const handleEditorChange = useCallback(
    (value) => {
      const fileId = activeFileIdRef.current;
      const previewId = previewTabIdRef.current;

      if (!fileId) return;

      // Update file content
      workspace.setFileContents((prev) => ({
        ...prev,
        [fileId]: value,
      }));

      // Auto-promote preview tab to permanent when editing
      if (previewId && previewId === fileId) {
        tabManager.setPreviewTabId(null);
      }
    },
    [workspace, tabManager],
  );

  // Handle cursor position changes from editor
  const handleCursorChange = useCallback((info) => {
    setCursorInfo(info);
  }, []);

  // Clipboard operations
  const handleCopyItem = useCallback((nodeId) => {
    setClipboardState({ nodeId, operation: "copy" });
  }, []);

  const handleCutItem = useCallback((nodeId) => {
    setClipboardState({ nodeId, operation: "cut" });
  }, []);

  const handlePasteItem = useCallback(
    (targetParentId) => {
      if (!clipboardState?.nodeId || !clipboardState?.operation) return;

      const sourceNode = workspace.flattenedNodes.get(clipboardState.nodeId);
      if (!sourceNode) {
        setClipboardState(null);
        return;
      }

      if (clipboardState.nodeId === targetParentId) return;

      if (clipboardState.operation === "copy") {
        const idMapping = {};
        const cloned = cloneNodeWithNewIds(sourceNode, idMapping);
        // We need to use workspace internals for copy
        workspace.moveItem.__treeDataSetter?.((prev) => addNodeToTree(prev, targetParentId, cloned.node));
        // For now, just use moveItem approach — copy via addItem
      } else if (clipboardState.operation === "cut") {
        workspace.moveItem(clipboardState.nodeId, targetParentId);
        setClipboardState(null);
      }
    },
    [clipboardState, workspace],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (event) => {
      const target = event.target;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.contentEditable === "true";
      if (isInput) return;

      const key = event.key.toLowerCase();
      if (key === "s" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (tabManager.previewTabId && tabManager.previewTabId === tabManager.activeFileId) {
          tabManager.setPreviewTabId(null);
        }
      }
      if (key === "w" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        if (tabManager.activeFileId) tabManager.closeTab(tabManager.activeFileId);
        return false;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [tabManager]);

  // Close create menu clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) {
        setShowCreateMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Create project handlers
  const handleCreateHelloWorld = useCallback(() => {
    workspace.createProject("hello-world");
    tabManager.resetTabs();
    setShowCreateMenu(false);
  }, [workspace, tabManager]);

  const handleCreateBlank = useCallback(() => {
    workspace.createProject("blank");
    tabManager.resetTabs();
    setShowCreateMenu(false);
  }, [workspace, tabManager]);

  const handleOpenGithubClone = useCallback(() => {
    setShowGithubClone(true);
    setShowCreateMenu(false);
    setGithubUrl("");
    setCloneStatus(null);
  }, []);

  const handleCloneGithub = useCallback(async () => {
    if (!githubUrl.trim()) return;
    setCloneStatus({ type: "loading", message: "Fetching repository from GitHub..." });

    try {
      await workspace.cloneFromGithub(githubUrl);
      tabManager.resetTabs();
      setCloneStatus({ type: "success", message: "Repository cloned successfully!" });
      setTimeout(() => {
        setShowGithubClone(false);
        setCloneStatus(null);
        setGithubUrl("");
      }, 1500);
    } catch (err) {
      setCloneStatus({ type: "error", message: err.message || "Failed to clone repository" });
    }
  }, [githubUrl, workspace, tabManager]);

  return (
    <div className="app-shell">
      <div className="app-main">
        <Sidebar tree={workspace.treeData} expandedFolders={workspace.expandedFolders} onToggleFolder={workspace.toggleFolder} onFileSelect={tabManager.selectFile} onNewFile={(name, parentId) => handleNewItem("file", name, parentId)} onNewFolder={(name, parentId) => handleNewItem("folder", name, parentId)} onDeleteItem={handleDeleteItem} onRenameItem={workspace.renameItem} onMoveItem={workspace.moveItem} onUploadFiles={workspace.uploadFiles} onCopyItem={handleCopyItem} onCutItem={handleCutItem} onPasteItem={handlePasteItem} clipboard={clipboardState} onCollapseAll={workspace.collapseAll} activeFileId={tabManager.activeFileId} />

        <div className="workspace">
          <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--border-color)", background: "var(--tab-bg)" }}>
            <Tabs tabs={tabManager.tabs} activeFileId={tabManager.activeFileId} previewTabId={tabManager.previewTabId} files={workspace.flattenedNodes} onTabSelect={tabManager.setActiveFileId} onTabClose={tabManager.closeTab} />

            <div className="create-new-container" ref={createMenuRef}>
              <button className="create-new-btn" onClick={() => setShowCreateMenu(!showCreateMenu)} title="Create New...">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="create-new-label">Create Project</span>
              </button>
              {showCreateMenu && (
                <div className="create-new-dropdown">
                  <div className="create-new-item" onClick={handleCreateHelloWorld}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Create Hello World
                  </div>
                  <div className="create-new-item" onClick={handleCreateBlank}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    Create Blank
                  </div>
                  <div className="create-new-item" onClick={handleOpenGithubClone}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    Clone from GitHub
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="editor-area">
            <Editor fileId={tabManager.activeFileId} filePath={activeFile?.path} content={activeContent} language={language} onChange={handleEditorChange} onCursorChange={handleCursorChange} />
          </div>

          <Terminal activeFileName={activeFile?.path} treeData={workspace.treeData} fileContents={workspace.fileContents} />
        </div>
      </div>

      {/* Status bar - full width at bottom */}
      <div className="status-bar">
        <div className="status-bar-left">{/* Empty or can add other info here */}</div>
        <div className="status-bar-right">
          <span className="status-bar-cursor">
            Ln {cursorInfo.lineNumber}, Col {cursorInfo.column}
          </span>
          {cursorInfo.selectedChars > 0 && <span className="status-bar-selection">({cursorInfo.selectedChars} Selected)</span>}
          <span className="status-bar-encoding">UTF-8</span>
          <span className="status-bar-eol">LF</span>
          <span className="status-bar-language">{getLanguageDisplayName(language)}</span>
        </div>
      </div>

      {showGithubClone && (
        <div className="github-clone-overlay">
          <div className="github-clone-dialog">
            <h3>Clone GitHub Repository</h3>
            <input type="text" placeholder="https://github.com/username/repository.git" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCloneGithub()} autoFocus />
            {cloneStatus && <div className={`clone-status ${cloneStatus.type}`}>{cloneStatus.message}</div>}
            <div className="dialog-buttons">
              <button className="btn-cancel" onClick={() => setShowGithubClone(false)}>
                Cancel
              </button>
              <button className="btn-clone" onClick={handleCloneGithub} disabled={cloneStatus?.type === "loading"}>
                Clone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
