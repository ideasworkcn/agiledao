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
  addColumn
}) => {
  return (
    <Draggable draggableId={columnId} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="bg-gray-50 rounded-lg p-4 w-fit m-2 shadow-md "
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
            {/* <button 
              onClick={() => addCard(columnId)}
              className="bg-blue-500 p-2 w-40 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
              aria-label="Add Feature"
              title="Add Feature"
            >
              <Plus className="w-4 h-4 text-white mr-1" />
              <span className="text-white text-sm font-medium">Add Feature</span>
            </button> */}
            <button
              className="mt-4 w-36 min-w-36 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              onClick={()=>addColumn(columnId)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Epic
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
                <button 
                  onClick={() => addCard(columnId)}
                  className="bg-blue-200 p-2 w-40 h-10 rounded-md flex items-center justify-center hover:bg-blue-400 transition-colors duration-200"
                  aria-label="Add Feature"
                  title="Add Feature"
                >
                  <Plus className="w-4 h-4  mr-1" />
                  <span className=" text-sm font-medium">Add Feature</span>
                </button>

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
