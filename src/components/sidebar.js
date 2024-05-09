import { useState } from "react";
import React from "react";

export default function Sidebar(props) {
  let selectedNode = props.value.selectedNode;
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <button onClick={props.value.onSaveChanges}>Save Changes</button>
      <div className="description"></div>
      {Object.keys(selectedNode).length == 0 ? (
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, "default")}
          draggable
        >
          Message
        </div>
      ) : (
        <div>
          <input
            type="text"
            onChange={(e) => {
              props.value.setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === selectedNode.id) {
                    node.data = {
                      ...node.data,
                      label: e.target.value,
                    };
                  }

                  return node;
                })
              );
            }}
            defaultValue={selectedNode.data.label}
          />
        </div>
      )}
    </aside>
  );
}
