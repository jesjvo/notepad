import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React, {useState, useEffect, useRef} from 'react'

const LargeText = (props) => {
    return (
    <>
    <NodeViewWrapper className="largetext" style={{padding:'10px 0 10px 0', fontSize:'1.25em', fontWeight:800}}>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
    </>
  );
};

export default LargeText;
