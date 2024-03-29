import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React, {useState, useEffect, useRef} from 'react'

const ipcRenderer = window.require("electron").ipcRenderer;

const Paragraph = (props) => {
    useEffect(() => {
      //reset node attributes.
      
    }, []);

    return (
    <>
    <NodeViewWrapper className="paragraph" style={{padding:'5px 0 5px 0', fontSize: '.9em', fontFamily:'Publico Text'}}>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
    </>
  );
};

export default Paragraph;
