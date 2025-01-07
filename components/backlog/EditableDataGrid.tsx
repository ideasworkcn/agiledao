import React, { useState } from 'react';
import type { UserStory } from "@/types/Model";

interface Column {
  key: keyof UserStory;
  name: string;
  width?: string;
  editable?: boolean;
  resizable?: boolean;
  sortable?: boolean;
  type?: 'string'|'number'|'textarea';
}

interface SortConfig {
  key: keyof UserStory | null;
  direction: 'asc' | 'desc';
}

interface EditableDataGridProps {
  columns: Column[];
  rows: UserStory[];
  onRowsChange: (updatedRows: UserStory[], options: { indexes: number[] }) => void;
}

const EditableDataGrid: React.FC<EditableDataGridProps> = ({ columns, rows, onRowsChange }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const handleSort = (columnKey: keyof UserStory) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedRows = React.useMemo(() => {
    if (!sortConfig.key) return rows;

    return [...rows].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [rows, sortConfig]);

  const handleInputChange = (rowIndex: number, columnKey: keyof UserStory, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [`${rowIndex}-${columnKey.toString()}`]: value,
    }));
  };

  const saveChanges = (rowIndex: number, columnKey: keyof UserStory) => {
    const inputValue = inputValues[`${rowIndex}-${columnKey.toString()}`];
    const columnType = columns.find(col => col.key === columnKey)?.type;
    
    let parsedValue: string | number = inputValue || rows[rowIndex][columnKey] as string;
    
    if (columnType === 'number') {
      parsedValue = parseFloat(inputValue);
      if (isNaN(parsedValue)) {
        parsedValue = rows[rowIndex][columnKey] as number;
      }
    }

    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { 
        ...row, 
        [columnKey]: parsedValue
      } : row
    );
    onRowsChange(updatedRows, { indexes: [rowIndex] });
    // Clear the input value after saving to prevent re-rendering issues
    setInputValues(prev => {
      const newValues = { ...prev };
      delete newValues[`${rowIndex}-${columnKey.toString()}`];
      return newValues;
    });
  };

  const handleInputBlur = (rowIndex: number, columnKey: keyof UserStory) => {
    saveChanges(rowIndex, columnKey);
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, columnKey: keyof UserStory) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      saveChanges(rowIndex, columnKey);
      const nextInput = document.querySelector(
        `input[data-row="${rowIndex}"][data-col="${columns.findIndex(col => col.key === columnKey) + 1}"]`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const renderEditableField = (col: Column, rowIndex: number, row: UserStory) => {
    const value = inputValues[`${rowIndex}-${col.key.toString()}`] ?? row[col.key];
    
    if (col.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => handleInputChange(rowIndex, col.key, e.target.value)}
          onBlur={() => handleInputBlur(rowIndex, col.key)}
          onKeyDown={(e) => handleKeyDown(e, rowIndex, col.key)}
          data-row={rowIndex}
          className="w-full bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 py-1 resize-y min-h-[2rem]"
          rows={1}
        />
      );
    }

    return (
      <input
        type={col.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => handleInputChange(rowIndex, col.key, e.target.value)}
        onBlur={() => handleInputBlur(rowIndex, col.key)}
        onKeyDown={(e) => handleKeyDown(e, rowIndex, col.key)}
        data-row={rowIndex}
        className="w-full bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 py-1"
      />
    );
  };

  const renderCellContent = (col: Column, row: UserStory) => {
    const value = row[col.key];
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value.toString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key.toString()}
                className={`cursor-pointer text-left py-3 px-4 font-semibold text-gray-700 border-b border-gray-200 ${
                  col.key === 'number' || col.key === 'name' || col.key === 'status' || col.key === 'importance'
                    ? ''
                    : 'hidden md:table-cell'
                }`}
                style={{ width: col.width }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center justify-between">
                  <span>{col.name}</span>
                  {sortConfig.key === col.key && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
              {columns.map((col, colIndex) => (
                <td
                  key={col.key.toString()}
                  className={`py-3 px-4 ${
                    col.key === 'number' || col.key === 'name' || col.key === 'status' ||  col.key === 'importance'
                      ? ''
                      : 'hidden md:table-cell'
                  }`}
                  style={{ width: col.width }}
                >
                  {col.editable ? (
                    renderEditableField(col, rowIndex, row)
                  ) : (
                    <span className="text-gray-700">{renderCellContent(col, row)}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditableDataGrid;