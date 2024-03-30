import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React, {useState, useEffect, useRef} from 'react'

const Title = (props) => {
    return (
    <>
    <NodeViewWrapper className="title" style={{padding:'10px 0 10px 0', fontSize:'1.65em', color:'rgba(0,0,0,1)', fontWeight:800}}>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
    </>
  );
};

export default Title;
