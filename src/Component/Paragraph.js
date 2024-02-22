import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { useState } from "react";

const Paragraph = (props) => {
  const [opacity, setOpacity] = useState(0)

  return (
    <NodeViewWrapper className="paragraph" style={{ display: "flex" }}>
      <div contentEditable={false} onMouseEnter={()=>setOpacity(1)}>  
        <button style={{opacity:opacity, transition:'.2s', position:'absolute', left:'40px', zIndex:100}}
        className='selectContentBtn'
          onMouseDown={(e) => {
            e.preventDefault();

            console.log(props);

            const endPos = props.getPos() + props.node.nodeSize;
            props.editor.commands.focus(endPos);
            props.editor.commands.insertContent({
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "New block added"
                }
              ]
            });
          }}
        >
          +
        </button>
      </div>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default Paragraph;
