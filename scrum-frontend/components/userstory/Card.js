import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { EllipsisVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditableText from "./EditableText";
import Story from "./Story";

const Card = ({
  item,
  index,
  onCardContentChange,
  onStoryContentChange,
  addStory,
  deleteStory,
  deleteCard,
}) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className=" p-4 mb-4 rounded-lg shadow-md flex flex-col items-stretch mx-2 w-64 bg-blue-200"
          style={{ 
            ...provided.draggableProps.style,
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <EditableText
              text={item.content}
              onTextChange={(newText) => onCardContentChange(item.id, newText)}
              className="text-gray-800 text-lg font-semibold"
            />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <button
                    onClick={() => {
                      window.confirm("Are you sure you want to delete this?") && deleteCard(item.id);
                    }}
                    className="w-full text-left text-sm text-red-600 hover:text-red-700 transition-colors duration-150"
                  >
                    Delete
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Droppable droppableId={item.id} type="story">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {item.backlogs.map((story, index) => (
                  <Story
                    key={story.id}
                    story={story}
                    index={index}
                    onStoryContentChange={onStoryContentChange}
                    deleteStory={deleteStory}
                  />
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="mt-3 px-2">
            <button
              className="w-full py-2 px-4 bg-yellow-300 text-gray-900 text-sm font-medium rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150 ease-in-out flex items-center justify-center"
              onClick={() => addStory(item.id)}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Add Story</span>
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
