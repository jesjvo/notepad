import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import Subtitle from "../Blocks/Subtitle";

export default Node.create({

  name: "subtitle",
  priority: 1000,
  addOptions: {
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
    return ReactNodeViewRenderer(Subtitle);
  },

  addCommands() {
    return {
      setSubtitle: () => ({ commands }) => {
        return commands.toggleNode("subtitle", 'subtitle');
      },
    };
  },
});
