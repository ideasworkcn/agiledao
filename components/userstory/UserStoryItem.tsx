import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { EllipsisVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EditableText from "./EditableText";
import type { Feature, UserStory } from "@/types/Model";


interface UserStoryItemProps {
  feature: Feature;
  userstory: UserStory;
  index: number;
  storyAdd: (featureId: string, story: any) => void;
  storyUpdate: (storyId: string, newContent: UserStory) => void;
  storyDelete: (storyId: string) => void;
}

export default function UserStoryItem({ 
  feature,
  userstory,
  index,
  storyAdd,
  storyUpdate,
  storyDelete
}: UserStoryItemProps) {
  
  const handleNameChange = (storyId: string, newText: string) => {
    storyUpdate(storyId, { 
      ...userstory, // Spread existing user story properties
      name: newText // Only update the name
    });
  };

  return (
    <Draggable key={userstory.id} draggableId={`${feature.id}-${userstory.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 bg-yellow-300 rounded  shadow-sm  transition-transform  duration-200 ${
            snapshot.isDragging  ? 'bg-yellow-200 scale-105'  : 'bg-white '
          }`}
        >
          <div className="flex justify-between items-center">
            <EditableText 
              text={userstory.name} 
              onTextChange={(newText: string) => handleNameChange(userstory.id, newText)} 
            />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="h-5 w-5 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this story?')) {
                        storyDelete(userstory.id);
                      }
                    }}
                    className="w-full text-left text-sm text-red-600"
                  >
                    Delete Story
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </Draggable>
  );
}