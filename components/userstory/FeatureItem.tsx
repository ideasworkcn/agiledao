import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { EllipsisVertical, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EditableText from "./EditableText";
import UserStoryItem from "./UserStoryItem";
import { Feature, UserStory } from "@/types/Model";

interface FeatureItemProps {
  feature: Feature;
  index:number;
  epicId: string;
  featureAdd: (epicId: string,feature_id:string) => void;
  featureUpdate: (featureId: string, newName: string) => void;
  featureDelete: (featureId: string) => void;
  storyAdd: (featureId: string) => void;
  storyUpdate: (storyId: string, userstory: UserStory) => void;
  storyDelete: (storyId: string) => void;
}

export default function FeatureItem({ 
  feature, 
  index,
  epicId,
  featureAdd,
  featureUpdate,
  featureDelete,
  storyAdd,
  storyUpdate,
  storyDelete
}: FeatureItemProps) {
  const handleNameChange = (featureId: string, newName: string) => {
    featureUpdate(featureId, newName);
  };

  return (
    <Draggable key={feature.id} draggableId={`${epicId}-${feature.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 bg-blue-100 w-64 rounded shadow-sm transition-transform duration-200 ${
            snapshot.isDragging ? 'bg-blue-100 scale-105' : ''
          }`}
        >
          <div className="flex justify-between items-center">
            <EditableText 
              className="pl-2 font-medium text-gray-800"
              text={feature.name} 
              onTextChange={(newText: string) => handleNameChange(feature.id, newText)} 
            />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="h-5 w-5 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <button 
                    onClick={() => featureAdd(epicId,feature.id)} 
                    className="w-full text-left text-sm text-blue-600"
                  >
                    Add Feature
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this feature and all its user stories?')) {
                        featureDelete(feature.id);
                      }
                    }} 
                    className="w-full text-left text-sm text-red-600"
                  >
                    Delete Feature
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Droppable droppableId={feature.id} type="USERSTORY">
            {(provided, snapshot) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                className={`space-y-2 mt-2 p-2 rounded transition-colors duration-200 ${
                  snapshot.isDraggingOver ? 'bg-yellow-100' : 'bg-blue-100'
                }`}
              >
                {feature.userstories?.map((userstory, index) => (
                  <UserStoryItem 
                    key={userstory.id}
                    userstory={userstory}
                    feature={feature}
                    index={index}
                    storyUpdate={storyUpdate}
                    storyDelete={storyDelete}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="mt-3 px-2">
            <button
              className="w-full py-2 px-4 bg-yellow-300 text-gray-900 text-sm font-medium rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150 ease-in-out flex items-center justify-center"
              onClick={() => storyAdd(feature.id)}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Add Story</span>
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}