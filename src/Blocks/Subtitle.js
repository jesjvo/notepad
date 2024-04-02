import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React, {useState, useEffect, useRef} from 'react'

const Subtitle = (props) => {
    return (
    <>
    <NodeViewWrapper className="subtitle" style={{padding:'10px 0 10px 0', fontSize:'1.5em', fontWeight:800}}>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
    </>
  );
};

export default Subtitle;
