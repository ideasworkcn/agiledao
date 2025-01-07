import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { EllipsisVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EditableText from "./EditableText";
import FeatureItem from "./FeatureItem";
import {Epic,UserStory} from "@/types/Model"

interface EpicItemProps {
  epic: Epic;
  index: number;
  epicDelete: (epicId: string) => void;
  epicUpdate: (epicId: string, newName: string) => void;
  epicAdd:(epicId:string)=>void;
  featureAdd: (epicId: string) => void;
  featureUpdate: (featureId: string, newName: string) => void;
  featureDelete: (featureId: string) => void;
  storyAdd: (featureId: string, story: any) => void;
  storyUpdate: (storyId: string, userstory: UserStory) => void;
  storyDelete: (storyId: string) => void;
}

export default function EpicItem({ 
  epic, 
  index, 
  epicDelete, 
  epicUpdate,
  epicAdd,
  featureAdd,
  featureUpdate,
  featureDelete,
  storyAdd,
  storyUpdate,
  storyDelete
}: EpicItemProps) {
  const handleNameChange = (newName: string) => {
    epicUpdate(epic.id, newName);
  };

  return (
    <Draggable draggableId={epic.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow min-w-[320px] w-fit flex-shrink-0 m-2 "
        >
          <div className="flex justify-between items-center mb-4">
            <EditableText 
              text={epic.name} 
              onTextChange={handleNameChange} 
              className="font-semibold text-lg text-gray-800"
            />
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:bg-gray-100 p-1 rounded-md transition-colors">
                <EllipsisVertical className="h-5 w-5 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[160px]">
                <DropdownMenuItem className="px-3 py-2">
                  <button 
                    onClick={() => epicAdd(epic.id)} 
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-700"
                  >
                    Add Epic
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-3 py-2">
                  <button 
                    onClick={() => featureAdd(epic.id)} 
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-700"
                  >
                    Add Feature
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-3 py-2">
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this epic and all its features and user stories?')) {
                        epicDelete(epic.id);
                      }
                    }} 
                    className="w-full text-left text-sm text-red-600 hover:text-red-700"
                  >
                    Delete Epic
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Droppable droppableId={epic.id} type="FEATURE" direction="horizontal">
            {(provided, snapshot) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                className={`min-h-[200px]  flex flex-row space-x-4 p-3 rounded-md transition-colors duration-200 ${
                  snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                {epic.features?.map((feature, index) => (
                  <FeatureItem 
                    key={feature.id}
                    feature={feature}
                    index={index}
                    epicId={epic.id}
                    featureAdd={featureAdd}
                    featureUpdate={featureUpdate}
                    featureDelete={featureDelete}
                    storyAdd={(featureId) => storyAdd(featureId, {})}
                    storyUpdate={storyUpdate}
                    storyDelete={storyDelete}
                  />
                )) }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}