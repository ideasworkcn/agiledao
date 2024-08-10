import React, { useState, useEffect, useRef } from 'react';

const EditableDataGrid = ({ 
  columns, 
  rows, 
  onRowsChange,
  className,
  style,
  headerRowHeight,
  rowHeight,
  ...props 
}) => {
  const [editCell, setEditCell] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const gridRef = useRef(null);
  const inputRef = useRef(null);

  const handleCellClick = (rowIndex, columnKey) => {
    const column = columns.find(col => col.key === columnKey);
    if (column && column.editable) {
      setEditCell({ rowIndex, columnKey });
    }
  };

  const handleCellChange = (rowIndex, columnKey, value) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [columnKey]: value };
    onRowsChange(newRows, { indexes: [rowIndex], columnKey, newValue: value });
    setEditCell(null);
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedRows = React.useMemo(() => {
    if (sortColumn) {
      return [...rows].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [rows, sortColumn, sortDirection]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gridRef.current && !gridRef.current.contains(event.target)) {
        setEditCell(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={gridRef} className={`overflow-x-auto ${className}`} style={style}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  ${column.sortable ? 'cursor-pointer' : 'cursor-default'}
                  p-1 sm:p-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700
                  ${column.width ? `w-${column.width}` : ''}
                  whitespace-nowrap overflow-hidden text-ellipsis
                `}
                onClick={() => column.sortable && handleSort(column.key)}
                title={column.name}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{column.name}</span>
                  {column.sortable && sortColumn === column.key && (
                    <span className="ml-1 flex-shrink-0">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => (
            <tr key={rowIndex} className={`h-${rowHeight} hover:bg-gray-50`}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`
                    p-2 sm:p-3 border-b border-gray-200 text-sm text-gray-900
                    ${column.width ? `w-${column.width}` : ''}
                  `}
                  onClick={() => handleCellClick(rowIndex, column.key)}
                >
                  {editCell && editCell.rowIndex === rowIndex && editCell.columnKey === column.key ? (
                    <input
                      ref={inputRef}
                      type="text"
                      defaultValue={row[column.key]}
                      onBlur={(e) => handleCellChange(rowIndex, column.key, e.target.value)}
                      autoFocus
                      className="w-full h-full p-1 border-none rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
                    />
                  ) : (
                    <div className="truncate">{row[column.key]}</div>
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