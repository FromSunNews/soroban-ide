import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { FileIconImg, FolderIconImg } from '../../components/icons/FileIcon';

/**
 * Rename input for renaming files/folders in the sidebar tree.
 */
const RenameInput = memo(({ type, depth, onSubmit, onCancel, defaultValue = '', isOpen = false }) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        const trimmed = value.trim();
        if (trimmed) onSubmit(trimmed);
        else onCancel();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    },
    [value, onSubmit, onCancel]
  );

  const handleBlur = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== defaultValue) {
      onSubmit(trimmed);
    } else {
      onCancel();
    }
  }, [value, defaultValue, onSubmit, onCancel]);

  const indent = depth * 8;
  const isFolder = type === 'folder';

  return (
    <div
      className="sidebar-inline-input rename-input"
      style={{ paddingLeft: `${indent + 32}px` }}
    >
      <span className="sidebar-node-icon">
        {isFolder
          ? <FolderIconImg folderName={value || defaultValue} isOpen={isOpen} size={18} />
          : <FileIconImg filename={value || defaultValue} size={18} />
        }
      </span>
      <input
        ref={inputRef}
        type="text"
        className="sidebar-inline-input-field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    </div>
  );
});

export default RenameInput;
