import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { EllipsisVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditableTextArea from "./EditableTextArea";
import Card from "./Card";

const Column = ({
  column,
  columnId,
  index,
  addCard,
  onColumnNameChange,
  onCardContentChange,
  onStoryContentChange,
  addStory,
  deleteStory,
  deleteCard,
  deleteColumn,
}) => {
  return (
    <Draggable draggableId={columnId} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="bg-white rounded-lg p-4 w-fit m-2 shadow-md "
          {...provided.dragHandleProps}
        >
          <div className="flex justify-between items-center py-2 text-lg font-semibold">
            <div className="flex justify-start items-center pl-2">
              <EditableTextArea
                text={column.name}
                onTextChange={(newText) =>
                  onColumnNameChange(columnId, newText)
                }
              />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="h-5 w-5 text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <button
                      className="w-full text-left text-sm text-blue-600"
                      onClick={() => addCard(columnId)}
                    >
                      新增 Feature
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      onClick={() => {
                        window.confirm("确定删除吗？") &&
                          deleteColumn(columnId);
                      }}
                      className="w-full text-left text-sm text-red-600"
                    >
                      删除 Epic
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <button 
              onClick={() => addCard(columnId)}
              className="bg-blue-500 p-2 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
              aria-label="Add Feature"
              title="Add Feature"
            >
              <Plus className="w-4 h-4 text-white mr-1" />
              <span className="text-white text-sm font-medium">Add Feature</span>
            </button>
          </div>

          <Droppable droppableId={columnId} direction="horizontal" type="task">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-64 flex flex-row space-x-4"
              >
                {column.features?.map((item, index) => (
                  <Card
                    key={item.id}
                    item={item}
                    index={index}
                    onCardContentChange={onCardContentChange}
                    onStoryContentChange={onStoryContentChange}
                    addStory={addStory}
                    deleteStory={deleteStory}
                    deleteCard={deleteCard}
                  />
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
