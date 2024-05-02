import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React from 'react'

const Paragraph = (props) => {

    return (
    <>
    <NodeViewWrapper className="paragraph" style={{padding:'5px 0 5px 0', fontSize: '.9em'}}>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
    </>
  );
};

export default Paragraph;
