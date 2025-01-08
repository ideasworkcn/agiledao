import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useToast } from "@/hooks/use-toast";
import type { DropResult } from "@hello-pangea/dnd";
import type { Epic, UserStory, Product } from "@/types/Model";
import EpicItem from "./EpicItem";
import { Plus } from "lucide-react";


export default function Board({ product }: { product: Product }) {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEpics = async () => {
      try {
        const response = await fetch(`/api/epic?product_id=${product.id}`);
        if (!response.ok) throw new Error("Failed to fetch epics");
        const data = await response.json();
        setEpics(data || []);
      } catch (error) {
        console.error("Error fetching epics:", error);
        toast({ title: "加载失败", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchEpics();
  }, [product.id]);

  const addEpic = async (epicId?: string) => {
    let newPx = (epics?.length || 0) + 1;
    let insertIndex = epics?.length || 0;
    
    if (epicId && epics) {
      const targetEpic = epics.find(epic => epic.id === epicId);
      if (targetEpic) {
        newPx = targetEpic.px + 1;
        insertIndex = epics.findIndex(epic => epic.id === epicId) + 1;
        
        // Update px values for epics after the target epic
        const updatedEpics = epics.map(epic => ({
          ...epic,
          px: epic.px >= newPx ? epic.px + 1 : epic.px
        }));

        // Create new epic
        const epic: Epic = {
          id: crypto.randomUUID(),
          product_id: product.id,
          name: `New Epic ${(epics?.length || 0) + 1}`,
          features: [],
          px: newPx
        };

        try {
          // First update existing epics' px values
          const batchResponse = await fetch('/api/epic/batch', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEpics),
          });
          if (!batchResponse.ok) throw new Error('Failed to update epic order');

          // Then add new epic
          const response = await fetch('/api/epic', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(epic),
          });
          if (!response.ok) throw new Error('Failed to add epic');
          const newEpic = await response.json();

          // Insert new epic at correct position
          updatedEpics.splice(insertIndex, 0, newEpic);
          setEpics(updatedEpics);
          toast({ title: "Epic 添加成功", variant: "default" });
        } catch (error) {
          console.error("Error adding epic:", error);
          toast({ title: "添加失败", variant: "destructive" });
        }
        return;
      }
    }

    // Default case when no epicId is provided
    const epic: Epic = {
      id: crypto.randomUUID(),
      product_id: product.id,
      name: `New Epic ${(epics?.length || 0) + 1}`,
      features: [],
      px: newPx
    };

    try {
      const response = await fetch('/api/epic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(epic),
      });
      if (!response.ok) throw new Error('Failed to add epic');
      const newEpic = await response.json();
      setEpics([...(epics || []), newEpic]);
      toast({ title: "Epic 添加成功", variant: "default" });
    } catch (error) {
      console.error("Error adding epic:", error);
      toast({ title: "添加失败", variant: "destructive" });
    }
  };

  const deleteEpic = async (epicId: string) => {
    try {
      await fetch(`/api/epic/${epicId}`, {
        method: 'DELETE',
      });
      setEpics(epics?.filter((epic) => epic.id !== epicId) || []);
      toast({ title: "Epic 删除成功", variant: "default" });
    } catch (error) {
      console.error("Error deleting epic:", error);
      toast({ title: "删除失败", variant: "destructive" });
    }
  };

  const updateEpic = async (epicId: string, newName: string) => {
    try {
      const response = await fetch(`/api/epic`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: epicId, name: newName }),
      });
      if (!response.ok) throw new Error('Failed to update epic');
      const updatedEpic = await response.json();
      setEpics(epics?.map((epic) => (epic.id === epicId ? { ...epic, name: updatedEpic.name } : epic)) || []);
      toast({ title: "Epic 更新成功", variant: "default" });
    } catch (error) {
      console.error("Error updating epic:", error);
      toast({ title: "更新失败", variant: "destructive" });
    }
  };

  const addFeature = async (epicId: string, feature_id?: string) => {
    const epic = epics?.find(epic => epic.id === epicId);
    if (!epic) return;

    let newPx = (epic.features?.length || 0) + 1;
    let updatedFeatures = [...(epic.features || [])];

    if (feature_id) {
      // 找到目标feature的index
      const targetIndex = updatedFeatures.findIndex(f => f.id === feature_id);
      if (targetIndex !== -1) {
        // 新feature插入到目标feature后面
        newPx = updatedFeatures[targetIndex].px + 1;
        // 更新后续feature的px
        updatedFeatures = updatedFeatures.map((f, index) => ({
          ...f,
          px: index > targetIndex ? f.px + 1 : f.px
        }));
      }
    }

    const newFeature = {
      name: 'New Feature',
      px: newPx,
      epic_id: epicId,
    };

    try {
      // 先批量更新已有feature的px
      if (feature_id && updatedFeatures.length > 0) {
        await fetch('/api/feature/batch', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedFeatures),
        });
      }

      // 添加新feature
      const response = await fetch('/api/feature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeature),
      });

      if (!response.ok) throw new Error('Failed to add feature');
      const createdFeature = await response.json();

      setEpics(epics?.map(epic => 
        epic.id === epicId 
          ? { ...epic, features: [...updatedFeatures, createdFeature] } 
          : epic
      ) || []);
      toast({ title: "Feature 添加成功", variant: "default" });
    } catch (error) {
      console.error("Error adding feature:", error);
      toast({ title: "添加失败", variant: "destructive" });
    }
  };

  const updateFeature = async (featureId: string, newName: string) => {
    try {
      const response = await fetch('/api/feature', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: featureId, name: newName }),
      });
      if (!response.ok) throw new Error('Failed to update feature');
      const updatedFeature = await response.json();
      setEpics(epics?.map(epic => ({
        ...epic,
        features: epic.features?.map(feature => 
          feature.id === featureId ? { ...feature, name: updatedFeature.name } : feature
        ) || []
      })) || []);
      toast({ title: "Feature 更新成功", variant: "default" });
    } catch (error) {
      console.error("Error updating feature:", error);
      toast({ title: "更新失败", variant: "destructive" });
    }
  };

  const deleteFeature = async (featureId: string) => {
    try {
      await fetch(`/api/feature/${featureId}`, {
        method: 'DELETE',
      });
      setEpics(epics?.map(epic => ({
        ...epic,
        features: epic.features?.filter(feature => feature.id !== featureId) || []
      })) || []);
      toast({ title: "Feature 删除成功", variant: "default" });
    } catch (error) {
      console.error("Error deleting feature:", error);
      toast({ title: "删除失败", variant: "destructive" });
    }
  };

  const addStory = async (featureId: string) => {
    try {
      const story: UserStory = {
        id: crypto.randomUUID(),
        feature_id: featureId,
        name: "New Story",
        status: "To Do",
        px: (epics?.flatMap(epic => epic.features || [])?.filter(feature => feature.id === featureId)?.length || 0) + 1,
        number: 0,
        importance: 0,
        estimate: 0,
        howtodemo: "",
        fzr: "",
        product_id: product.id
      };
      const response = await fetch('/api/userstory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(story),
      });
      if (!response.ok) throw new Error('Failed to add story');
      const newStory = await response.json();
      
      // Only update state after successful API response
      setEpics(prevEpics => prevEpics?.map(epic => ({
        ...epic,
        features: epic.features?.map(feature => 
          feature.id === featureId
            ? { ...feature, userstories: [...(feature.userstories || []), newStory] }
            : feature
        ) || []
      })) || []);
      
      toast({ title: "Story 添加成功", variant: "default" });
    } catch (error) {
      console.error("Error adding story:", error);
      toast({ title: "添加失败", variant: "destructive" });
    }
  };

  const updateStory = async (storyId: string, userStory: UserStory) => {
    try {
      const response = await fetch('/api/userstory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userStory),
      });
      if (!response.ok) throw new Error('Failed to update story');
      const updatedStory = await response.json();
      
      // Only update state after successful API response
      setEpics(prevEpics => prevEpics?.map(epic => ({
        ...epic,
        features: epic.features?.map(feature => ({
          ...feature,
          userstories: feature.userstories?.map(story => 
            story.id === storyId ? { ...story, ...updatedStory } : story
          ) || []
        })) || []
      })) || []);
      
      toast({ title: "Story 更新成功", variant: "default" });
    } catch (error) {
      console.error("Error updating story:", error);
      toast({ title: "更新失败", variant: "destructive" });
    }
  };

  const deleteStory = async (storyId: string) => {
    try {
      const response = await fetch(`/api/userstory/${storyId}`, {
        method: 'DELETE',
      });
      
      // Only update state after successful deletion
      if (response.ok) {
        setEpics(prevEpics => prevEpics?.map(epic => ({
          ...epic,
          features: epic.features?.map(feature => ({
            ...feature,
            userstories: feature.userstories?.filter(story => story.id !== storyId) || []
          })) || []
        })) || []);
        toast({ title: "Story 删除成功", variant: "default" });
      } else {
        throw new Error('Failed to delete story');
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({ title: "删除失败", variant: "destructive" });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    console.log('Drag ended:', result); // 添加调试日志
    const { source, destination, type } = result;
    if (!destination) return;

    // Check if position has changed
    if (source.droppableId === destination.droppableId && 
        source.index === destination.index) {
      return;
    }

    if (type === "EPIC") {
      // Save original state for rollback
      const originalEpics = [...(epics || [])];
      
      // Create new order
      const newEpics = Array.from(epics || []);
      const [removed] = newEpics.splice(source.index, 1);
      newEpics.splice(destination.index, 0, removed);

      // Update px values
      const updatedEpics = newEpics.map((epic, index) => ({
        ...epic,
        px: index,
      }));

      // Optimistically update UI first
      setEpics(newEpics);

      try {
        // Attempt to save new order
        await fetch('/api/epic/batch', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedEpics),
        });
        toast({ title: "顺序保存成功", variant: "default" });
      } catch (error) {
        console.error("Error saving order:", error);
        // Rollback to original state if save fails
        setEpics(originalEpics);
        toast({ title: "保存失败", variant: "destructive" });
      }
    }
    
    if (type === "FEATURE") {
      const sourceEpic = epics?.find(epic => epic.id === source.droppableId);
      const destinationEpic = epics?.find(epic => epic.id === destination.droppableId);

      if (!sourceEpic || !destinationEpic) return;

      // Save original state for rollback
      const originalEpics = [...(epics || [])];

      const sourceFeatures = Array.from(sourceEpic.features || []);
      const [removedFeature] = sourceFeatures.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        // Moving within same epic
        sourceFeatures.splice(destination.index, 0, removedFeature);
        
        // Update px values for all features in the epic
        const updatedFeatures = sourceFeatures.map((f, i) => ({...f, px: i}));
        
        const updatedEpics = epics?.map(epic => {
          if (epic.id === sourceEpic.id) {
            return { 
              ...epic, 
              features: updatedFeatures
            };
          }
          return epic;
        }) || [];

        // Optimistically update UI
        setEpics(updatedEpics);

        try {
          await fetch('/api/feature/batch', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFeatures),
          });
          toast({ title: "Feature 顺序保存成功", variant: "default" });
        } catch (error) {
          console.error("Error saving feature order:", error);
          // Rollback to original state
          setEpics(originalEpics);
          toast({ title: "保存失败", variant: "destructive" });
        }
      } else {
        // Moving between epics
        const destinationFeatures = Array.from(destinationEpic.features || []);
        const movedFeature = {...removedFeature, epic_id: destinationEpic.id};
        destinationFeatures.splice(destination.index, 0, movedFeature);

        // Update px values for both source and destination features
        const updatedSourceFeatures = sourceFeatures.map((f, i) => ({...f, px: i}));
        const updatedDestinationFeatures = destinationFeatures.map((f, i) => ({...f, px: i}));

        const updatedEpics = epics?.map(epic => {
          if (epic.id === sourceEpic.id) {
            return { 
              ...epic, 
              features: updatedSourceFeatures
            };
          } else if (epic.id === destinationEpic.id) {
            return { 
              ...epic, 
              features: updatedDestinationFeatures
            };
          }
          return epic;
        }) || [];

        // Optimistically update UI
        setEpics(updatedEpics);

        try {
          // Update source epic features
          await fetch('/api/feature/batch', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSourceFeatures),
          });

          // Update destination epic features with the moved feature
          await fetch('/api/feature/batch', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDestinationFeatures),
          });

          toast({ title: "Feature 移动成功", variant: "default" });
        } catch (error) {
          console.error("Error moving feature:", error);
          // Rollback to original state
          setEpics(originalEpics);
          toast({ title: "移动失败", variant: "destructive" });
        }
      }
    }
   if (type === 'USERSTORY') {
    const sourceEpic = epics.find(epic => 
      epic.features.some(feature => feature.id === source.droppableId)
    );
    const destinationEpic = epics.find(epic => 
      epic.features.some(feature => feature.id === destination.droppableId)
    );

    if (sourceEpic && destinationEpic) {
      const sourceFeature = sourceEpic.features.find(f => f.id === source.droppableId);
      const destinationFeature = destinationEpic.features.find(f => f.id === destination.droppableId);

      if (sourceFeature && destinationFeature) {
        // Check if position hasn't changed
        if (source.droppableId === destination.droppableId &&
            source.index === destination.index) {
          return;
        }

        const originalEpics = [...epics];
        
        // Remove from source
        const [movedStory] = sourceFeature.userstories.splice(source.index, 1);
        
        // Update feature_id when moving to new feature
        const updatedStory = {
          ...movedStory,
          feature_id: destinationFeature.id
        };
        
        // Add to destination
        destinationFeature.userstories.splice(destination.index, 0, updatedStory);

        // Update px values for both source and destination features' user stories
        const updatedSourceStories = sourceFeature.userstories.map((s, i) => ({...s, px: i}));
        const updatedDestinationStories = destinationFeature.userstories.map((s, i) => ({...s, px: i}));

        const updatedEpics = epics.map(epic => {
          if (epic.id === sourceEpic.id) {
            return {
              ...epic,
              features: epic.features.map(f => 
                f.id === sourceFeature.id 
                  ? {...f, userstories: updatedSourceStories}
                  : f
              )
            };
          } else if (epic.id === destinationEpic.id) {
            return {
              ...epic,
              features: epic.features.map(f => 
                f.id === destinationFeature.id 
                  ? {...f, userstories: updatedDestinationStories}
                  : f
              )
            };
          }
          return epic;
        });

        // Optimistically update UI
        setEpics(updatedEpics);

        try {
          // First update the moved story's feature_id
          await fetch('/api/userstory', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: updatedStory.id,
              feature_id: updatedStory.feature_id
            }),
          });

          // Then update source feature stories
          await fetch('/api/userstory/batch', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSourceStories),
          });

          // Finally update destination feature stories
          await fetch('/api/userstory/batch', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDestinationStories),
          });

          toast({ title: "User Story 移动成功", variant: "default" });
        } catch (error) {
          console.error("Error moving user story:", error);
          // Rollback to original state
          setEpics(originalEpics);
          toast({ title: "移动失败", variant: "destructive" });
        }
      }
    }
  }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable 
        droppableId="epics" 
        direction="horizontal" 
        type="EPIC"
      >
        {(provided) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef} 
            className="flex flex-nowrap overflow-x-auto p-4 space-x-4 min-h-[calc(100vh-200px)]"
          >
            {epics.map((epic, index) => (
              <EpicItem
                key={epic.id}
                epic={epic}
                index={index}
                epicDelete={deleteEpic}
                epicUpdate={updateEpic}
                epicAdd={addEpic}
                featureAdd={addFeature}
                featureUpdate={updateFeature}
                featureDelete={deleteFeature}
                storyAdd={addStory}
                storyUpdate={updateStory}
                storyDelete={deleteStory}
              />
            ))}
            {provided.placeholder}
            <div className="flex items-center">
              <button
                onClick={() => addEpic()}
                className="h-40 w-60 bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors duration-200"
              >
                <Plus className="w-8 h-8 text-gray-400" />
                <span className="text-gray-600 font-medium">Add Epic</span>
              </button>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
    </>
  );
}