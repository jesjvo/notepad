import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import LargeText from "../Blocks/LargeText";

export default Node.create({

  name: "largetext",
  priority: 1000,
  defaultOptions: {
    HTMLAttributes: {
    }
  },
  group: "block",
  content: "inline*",

  parseHTML: () => {
    return [{ tag: "div" }];
  },

  renderHTML: ({ HTMLAttributes }) => {
    return ["div", mergeAttributes(HTMLAttributes, { class: "block"}), 0];
  },

  addNodeView: () => {
    return ReactNodeViewRenderer(LargeText);
  },

  addCommands() {
    return {
      setLargeText: () => ({ commands }) => {
        return commands.toggleNode("largetext", 'largetext');
      },
    };
  },
});
