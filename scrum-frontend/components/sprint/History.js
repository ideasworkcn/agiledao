"use client";

import React from "react";

function History({ sprintList, getSprintById, productId, createSprint, product }) {
  return (
    <aside className="hidden w-58 shrink-0 border-r bg-white sm:flex  rounded-lg">
      <div className="flex h-full flex-col p-4">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">迭代规划列表</h3>
        <div className="space-y-3">
          <button
            onClick={() => createSprint(productId)}
            className="w-full rounded-md bg-blue-500 py-2 text-sm font-medium text-white active:bg-blue-600 transition-colors"
          >
            添加 Sprint
          </button>
          {sprintList.map((sprint) => (
            <div
              key={sprint.id}
              onClick={() => getSprintById(sprint.id)}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-md hover:shadow-lg active:bg-gray-50 cursor-pointer transition-all duration-300"
            >
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                {sprint.name}
                <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {sprint.status || 'Active'}
                </span>
              </h4>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {sprint.startDate} - {sprint.endDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default History;
