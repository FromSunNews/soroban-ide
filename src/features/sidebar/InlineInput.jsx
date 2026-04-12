import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { FileIconImg, FolderIconImg } from '../../components/icons/FileIcon';

/**
 * Inline input for creating new files/folders in the sidebar tree.
 */
const InlineInput = memo(({ type, depth, onSubmit, onCancel, defaultValue = '' }) => {
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
      } else if (e.key === 'Escape') {
        onCancel();
      }
    },
    [value, onSubmit, onCancel]
  );

  const handleBlur = useCallback(() => {
    setTimeout(() => onCancel(), 200);
  }, [onCancel]);

  const indent = depth * 8;
  const isFolder = type === 'folder';

  return (
    <div
      className="sidebar-inline-input"
      style={{ paddingLeft: `${indent + 32}px` }}
    >
      <span className="sidebar-node-icon">
        {isFolder
          ? <FolderIconImg folderName="" isOpen={false} size={18} />
          : <FileIconImg filename={value || 'file.txt'} size={18} />
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
        placeholder={isFolder ? 'New Folder' : 'New File'}
      />
    </div>
  );
});

export default InlineInput;
