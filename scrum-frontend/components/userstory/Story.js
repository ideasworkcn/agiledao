import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditableText from "./EditableText";

const Story = ({ story, index, onStoryContentChange, deleteStory }) => {
  return (
    <Draggable draggableId={story.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="bg-yellow-300 p-4 mb-3 rounded-lg shadow-md flex justify-between items-center mx-2 h-fit"
          style={{ 
            ...provided.draggableProps.style,
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <EditableText
            text={story.name}
            onTextChange={(newText) => onStoryContentChange(story.id, newText)}
            className="text-gray-800 text-sm font-medium"
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this story?")) {
                      deleteStory(story.id);
                    }
                  }}
                  className="w-full text-left text-sm text-red-600 hover:text-red-700 transition-colors duration-150"
                >
                  Delete Story
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Draggable>
  );
};

export default Story;
