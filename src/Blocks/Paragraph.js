import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React, {useState, useEffect, useRef} from 'react'

const Paragraph = (props) => {
    useEffect(() => {
      //reset node attributes.
      
    }, []);

    return (
    <>
    <NodeViewWrapper className="paragraph" style={{padding:'5px 0 5px 0', fontSize: '1em'}}>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
    </>
  );
};

export default Paragraph;
