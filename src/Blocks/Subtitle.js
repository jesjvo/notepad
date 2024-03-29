import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React, {useState, useEffect, useRef} from 'react'

const ipcRenderer = window.require("electron").ipcRenderer;

const Subtitle = (props) => {
    return (
    <>
    <NodeViewWrapper className="subtitle" style={{padding:'10px 0 10px 0', fontSize:'1.4em', fontFamily:'Publico Text', fontWeight:800}}>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
    </>
  );
};

export default Subtitle;
