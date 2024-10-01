import React, { useState } from 'react';

const EditableDataGrid = ({ columns, rows, onRowsChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [inputValues, setInputValues] = useState({});

  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedRows = React.useMemo(() => {
    if (sortConfig.key) {
      return [...rows].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return rows;
  }, [rows, sortConfig]);

  const handleInputChange = (rowIndex, columnKey, value) => {
    setInputValues((prev) => ({
      ...prev,
      [`${rowIndex}-${columnKey}`]: value,
    }));
  };

  const handleInputBlur = (rowIndex, columnKey) => {
    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, [columnKey]: inputValues[`${rowIndex}-${columnKey}`] || row[columnKey] } : row
    );
    onRowsChange(updatedRows, { indexes: [rowIndex] });
  };

  return (
    <table className="w-full">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{ width: col.width, cursor: 'pointer' }}
              onClick={() => handleSort(col.key)}
            >
              {col.name} {sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col) => (
              <td key={col.key} style={{ width: col.width }}>
                {col.editable ? (
                  <input
                    type="text"
                    value={inputValues[`${rowIndex}-${col.key}`] ?? row[col.key]}
                    onChange={(e) => handleInputChange(rowIndex, col.key, e.target.value)}
                    onBlur={() => handleInputBlur(rowIndex, col.key)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  row[col.key]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditableDataGrid;