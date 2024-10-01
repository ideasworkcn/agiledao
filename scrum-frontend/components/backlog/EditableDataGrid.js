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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`cursor-pointer text-left py-3 px-4 font-semibold text-gray-700 border-b border-gray-200 ${
                  col.key === 'number' || col.key === 'name' || col.key === 'status' || col.key === 'importance'
                    ? ''
                    : 'hidden md:table-cell'
                }`}
                style={{ width: col.width }}
                onClick={() => handleSort(col.key)}
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
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-4 ${
                    col.key === 'number' || col.key === 'name' || col.key === 'status' ||  col.key === 'importance'
                      ? ''
                      : 'hidden md:table-cell'
                  }`}
                  style={{ width: col.width }}
                >
                  {col.editable ? (
                    <input
                      type="text"
                      value={inputValues[`${rowIndex}-${col.key}`] ?? row[col.key]}
                      onChange={(e) => handleInputChange(rowIndex, col.key, e.target.value)}
                      onBlur={() => handleInputBlur(rowIndex, col.key)}
                      className="w-full bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 py-1"
                    />
                  ) : (
                    <span className="text-gray-700">{row[col.key]}</span>
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