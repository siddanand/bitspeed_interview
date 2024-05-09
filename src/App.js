import "./App.css";
import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./components/sidebar.js";

let id = 0;
const getId = () => `dndnode_${id++}`;

function App() {
  let count = 0;
  const reactFlowWrapper = useRef(null);
  const [selectedNode, setSelectedNode] = useState({});
  const [currentEdge, setCurrentEdge] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => {
    setCurrentEdge(params);
  }, []);

  useEffect(() => {
    if (edges.length != 0) {
      let find = edges.find((item) => item.source == currentEdge.source);
      if (!find) {
        setEdges((eds) => addEdge(currentEdge, eds));
      }
    } else {
      setEdges((eds) => addEdge(currentEdge, eds));
    }
  }, [currentEdge]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onSaveChanges = () => {
    let count = 0;
    if (nodes.length > 1) {
      nodes.forEach((item) => {
        let check = false;
        edges.forEach((edge) => {
          if (item.id == edge.source) {
            check = true;
          }
        });
        if (check == false) {
          count = count + 1;
        }
        if (count > 1) {
          alert("CANNOT SAVE FLOW");
        }
      });
    }
    edges.forEach((item) => {
      edges.forEach((edge) => {
        if (item.source == edge.target && edge.source == item.target) {
          alert("CANNOT SAVE FLOW");
        }
      });
    });
  };

  const onDrop = useCallback(
    (event) => {
      count++;
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `test message ${count}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onNodeClick = (e, node) => {
    setSelectedNode(node);
  };
  const onPanelClick = () => {
    setSelectedNode({});
  };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          ref={reactFlowWrapper}
          style={{ height: "100vh", width: "100% auto" }}
        >
          <ReactFlow
            nodes={nodes}
            connectionMode="strict"
            edges={edges}
            onNodeClick={onNodeClick}
            onPaneClick={onPanelClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar value={{ selectedNode, setNodes, onSaveChanges }} />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
