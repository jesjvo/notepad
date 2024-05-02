import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React from 'react'

const LargeText = (props) => {
    return (
    <>
    <NodeViewWrapper className="largetext" style={{padding:'5px 0 5px 0', fontSize:'1.15em', fontWeight:800}}>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
    </>
  );
};

export default LargeText;
