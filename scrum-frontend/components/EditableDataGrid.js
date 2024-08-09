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
    <div ref={gridRef} className={className} style={style}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ height: `${headerRowHeight}px` }}>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ 
                  width: column.width, 
                  cursor: column.sortable ? 'pointer' : 'default',
                  padding: '8px',
                  borderBottom: '1px solid #ddd',
                  textAlign: 'left'
                }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                {column.name}
                {column.sortable && sortColumn === column.key && (
                  <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ height: `${rowHeight}px` }}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{ 
                    width: column.width, 
                    padding: '8px',
                    borderBottom: '1px solid #ddd'
                  }}
                  onClick={() => handleCellClick(rowIndex, column.key)}
                >
                  {editCell && editCell.rowIndex === rowIndex && editCell.columnKey === column.key ? (
                    <input
                      ref={inputRef}
                      type="text"
                      defaultValue={row[column.key]}
                      onBlur={(e) => handleCellChange(rowIndex, column.key, e.target.value)}
                      autoFocus
                      style={{
                        width: '100%',
                        height: '100%',
                        padding: '8px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        boxShadow: '0 0 0 2px rgba(0, 122, 255, 0.5)',
                        transition: 'box-shadow 0.2s ease-in-out'
                      }}
                    />
                  ) : (
                    row[column.key]
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