import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import Title from "../Blocks/Title";

export default Node.create({

  name: "title",
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
    return ReactNodeViewRenderer(Title);
  },

  addCommands() {
    return {
      setTitle: () => ({ commands }) => {
        return commands.toggleNode("title", 'title');
      },
    };
  },
});
