import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React from 'react'

const Subtitle = (props) => {
    return (
    <>
    <NodeViewWrapper className="subtitle" style={{padding:'7.5px 0 7.5px 0', fontSize:'1.4em', fontWeight:800}}>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
    </>
  );
};

export default Subtitle;
