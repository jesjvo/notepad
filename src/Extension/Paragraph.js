import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import Paragraph from "../Blocks/Paragraph";

export default Node.create({
  name: "paragraph",
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
    return ReactNodeViewRenderer(Paragraph);
  },

  addCommands() {
    return {
      setParagraph: () => ({ commands }) => {
        return commands.toggleNode("paragraph", "paragraph");
      }
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
});
