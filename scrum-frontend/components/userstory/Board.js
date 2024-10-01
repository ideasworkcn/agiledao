import React from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Column from "./Column";
import {
  addEpic,
  deleteEpic,
  modifyEpic,
  addFeature,
  deleteFeature,
  modifyFeature,
  addBacklog,
  deleteBacklog,
  modifyBacklog,
  updateEpicPx,
  updatedFeaturePx,
  updatedBacklogPx,
} from "@/api/userstory.api";
import { useToast } from "@/components/ui/use-toast";

const Board = ({ columns, setColumns, product }) => {
  let productId = product.id;
  const { toast } = useToast();

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "column") {
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);

      // 设置px
      const updatedColumns = newColumns.map((column, index) => ({
        ...column,
        px: index,
      }));

      updateEpicPx(updatedColumns).then(() => {
        toast({ title: "保存成功", status: "success" });
        setColumns(newColumns);
      });

      return;
    }

    if (type === "task") {
      const sourceColumn = columns.find(
        (column) => column.id === source.droppableId
      );
      const destColumn = columns.find(
        (column) => column.id === destination.droppableId
      );
      const sourceFeatures = [...sourceColumn.features];
      const destFeatures = [...destColumn.features];
      const [removed] = sourceFeatures.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceFeatures.splice(destination.index, 0, removed);
        const updatedFeatures = sourceFeatures.map((feature, index) => ({
          ...feature,
          px: index,
        }));

        updatedFeaturePx(updatedFeatures).then((res) => {
          toast({ title: "保存成功", status: "success" });

          console.log(res);
          setColumns(
            columns.map((column) =>
              column.id === source.droppableId
                ? { ...column, features: updatedFeatures }
                : column
            )
          );
        });
      } else {
        destFeatures.splice(destination.index, 0, removed);
        const updatedFeatures = destFeatures.map((feature, index) => ({
          ...feature,
          px: index,
        }));
        updatedFeaturePx(updatedFeatures).then((res) => {
          console.log(res);
          toast({ title: "保存成功", status: "success" });

          setColumns(
            columns.map((column) =>
              column.id === source.droppableId
                ? { ...column, features: sourceFeatures }
                : column.id === destination.droppableId
                ? { ...column, features: updatedFeatures }
                : column
            )
          );
        });
      }
    } else if (type === "story") {
      const sourceCard = columns
        .flatMap((column) => column.features)
        .find((item) => item.id === source.droppableId);
      const destCard = columns
        .flatMap((column) => column.features)
        .find((item) => item.id === destination.droppableId);
      const sourceStories = [...sourceCard.backlogs];
      const destStories = [...destCard.backlogs];
      const [removed] = sourceStories.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceStories.splice(destination.index, 0, removed);

        const updatedBacklogs = sourceStories.map((backlog, index) => ({
          ...backlog,
          px: index,
        }));
        updatedBacklogPx(updatedBacklogs).then(() => {
          toast({ title: "保存成功", status: "success" });

          setColumns(
            columns.map((column) => ({
              ...column,
              features: column.features.map((item) =>
                item.id === source.droppableId
                  ? { ...item, backlogs: updatedBacklogs }
                  : item
              ),
            }))
          );
        });
      } else {
        destStories.splice(destination.index, 0, removed);
        const updatedBacklogs = destStories.map((backlog, index) => ({
          ...backlog,
          px: index,
        }));
        updatedBacklogPx(updatedBacklogs).then(() => {
          toast({ title: "保存成功", status: "success" });

          setColumns(
            columns.map((column) => ({
              ...column,
              features: column.features.map((item) =>
                item.id === source.droppableId
                  ? { ...item, backlogs: sourceStories }
                  : item.id === destination.droppableId
                  ? { ...item, backlogs: updatedBacklogs }
                  : item
              ),
            }))
          );
        });
      }
    }
  };

  const addColumn = ( columnId ) => {
    // console.log(columnId)
    const columnIndex = columns.length > 0 ? columns.findIndex((column) => column.id === columnId) : -1;
    // console.log(columnIndex)
    const newColumn = {
      id: null,
      name: `Epic Story ${columns.length + 1}`,
      number: "",
      productId: productId,
      px: columnIndex + 1 // Corrected px assignment
    };
  
    addEpic(newColumn).then((data) => {
      console.log(data);
      const updatedColumns = columns.map((column, index) => ({
        ...column,
        px: index > columnIndex ? column.px + 1 : column.px, // Increment px for columns after the new column
      }));
      const newColumnWithId = { ...newColumn, id: data.id }; // Ensure newColumn has the ID from the response
      updatedColumns.splice(columnIndex + 1, 0, newColumnWithId);
      setColumns([...updatedColumns]); // Ensure state is updated with new columns array
    });
  };

  const deleteColumn = (columnId) => {
    console.log(columnId);
    deleteEpic(columnId).then((res) => {
      console.log(res);
      setColumns(columns.filter((column) => column.id !== columnId));
    });
  };

  const addCard = (columnId) => {
    const itemCount = columns.reduce(
      (total, column) => total + (column.features?.length || 0),
      0
    );
    const newCardId = `Feature-${itemCount + 1}`;
    const newCard = {
      id: newCardId,
      number: null,
      productId: productId,
      epicId: columnId,
      content: `Feature ${itemCount + 1}`,
      backlogs: [],
    };
    addFeature(newCard).then((data) => {
      console.log(data);
      setColumns(
        columns.map((column) =>
          column.id === columnId
            ? { ...column, features:  [...(column.features ?? []), data] }
            : column
        )
      );
    });
  };

  const deleteCard = (cardId) => {
    deleteFeature(cardId).then((res) => {
      console.log(res);
      setColumns(
        columns.map((column) => ({
          ...column,
          features: column.features.filter((item) => item.id !== cardId),
        }))
      );
    });
  };

  const addStory = (cardId) => {
    // 获取所有现有的故事总数
    const allStoriesCount = columns.reduce((count, column) => {
      return (
        count +
        column.features.reduce((itemCount, item) => {
          return itemCount + + (item.backlogs?.length || 0); 
        }, 0)
      );
    }, 0);

    // 新故事的 id 基于所有故事的总数
    const newStoryId = `story-${allStoriesCount + 1}`;
    const backlog = {
      id: newStoryId,
      number: null,
      productId: productId,
      featureId: cardId,
      name: `新用户故事 ${allStoriesCount + 1}`,
      importance: 0,
      initialEstimate: 0,
      howToDemo: "",
      notes: "",
    };
    addBacklog(backlog).then((data) => {
      console.log(data);
      setColumns(
        columns.map((column) => ({
          ...column,
          features: column.features.map((item) =>
            item.id === cardId
              ? {
                  ...item,
                  backlogs: [...(item.backlogs ?? []), data],
                }
              : item
          ),
        }))
      );
    });
  };

  const deleteStory = (storyId) => {
    console.log(storyId);

    deleteBacklog(storyId).then((res) => {
      toast({ title: "删除成功", status: "success" });
      console.log(res);
      setColumns(
        columns.map((column) => ({
          ...column,
          features: column.features.map((item) => ({
            ...item,
            backlogs: item.backlogs.filter((story) => story.id !== storyId),
          })),
        }))
      );
    });
  };
  const updateColumnName = (columnId, newName) => {
    const currentColumn = columns.find((column) => column.id === columnId);
    currentColumn.name = newName;
    let saveColumn = { ...currentColumn };
    delete saveColumn.features;
    modifyEpic(saveColumn).then((data) => {
      toast({ title: "保存成功", status: "success" });
      console.log(data);
      setColumns(
        columns.map((column) =>
          column.id === columnId ? { ...column, name: newName } : column
        )
      );
    });
  };

  const updateCardContent = (cardId, newContent) => {
    for (let column of columns) {
      for (let feature of column.features) {
        if (feature.id === cardId) {
          feature.content = newContent;
          console.log(feature);
          modifyFeature(feature).then((data) => {
            toast({ title: "保存成功", status: "success" });
            setColumns(
              columns.map((column) => ({
                ...column,
                features: column.features.map((item) =>
                  item.id === cardId ? { ...item, content: newContent } : item
                ),
              }))
            );
          });
        }
      }
    }
  };

  const updateStoryContent = (storyId, newContent) => {
    for (let column of columns) {
      for (let feature of column.features) {
        for (let backlog of feature.backlogs) {
          if (backlog.id === storyId) {
            backlog.name = newContent;
            console.log(backlog);
            modifyBacklog(backlog).then((data) => {
              toast({ title: "保存成功", status: "success" });
              console.log(data);
              setColumns(
                columns.map((column) => ({
                  ...column,
                  features: column.features.map((item) => ({
                    ...item,
                    backlogs: item.backlogs.map((story) =>
                      story.id === storyId ? data : story
                    ),
                  })),
                }))
              );
            });
          }
        }
      }
    }
  };

  return (
    <>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex justify-center "
          >
            {columns.map((column, index) => (
              <Column
                key={column.id}
                column={column}
                columnId={column.id}
                index={index}
                addColumn={addColumn}
                addCard={addCard}
                deleteCard={deleteCard}
                onColumnNameChange={updateColumnName}
                onCardContentChange={updateCardContent}
                onStoryContentChange={updateStoryContent}
                addStory={addStory}
                deleteStory={deleteStory}
                deleteColumn={deleteColumn}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
     
    </DragDropContext>
    {columns.length === 0 && (
      <button
      className="mt-4 w-40 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
      onClick={() => addColumn({ columnId: null })} // 传递 null 作为 columnId
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
      Add Epic
    </button>
    )}
    </>
  );
};

export default Board;
