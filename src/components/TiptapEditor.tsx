"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";

type Props = {
  initialHtml?: string;
  onChange?: (html: string) => void;
  showPreview?: boolean;
};

export default function TiptapEditor({ initialHtml = "<p></p>", onChange, showPreview = true }: Props) {
  const [contentHtml, setContentHtml] = useState(initialHtml);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] mt-3 rounded-2xl p-6 border-2 border-gray-300 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-inner focus:outline-none overflow-auto transition-all duration-300 hover:shadow-lg prose prose-sm md:prose-base max-w-none",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const html = editor.getHTML();
      setContentHtml(html);
      onChange?.(html);
      setWordCount(editor.getText().trim().split(/\s+/).filter(Boolean).length);
    };

    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor, onChange]);

  // Keep editor in sync if parent changes initialHtml
  useEffect(() => {
    if (editor && initialHtml && editor.getHTML() !== initialHtml) {
      editor.commands.setContent(initialHtml, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHtml]);

  if (!editor) return null;

  return (
    <div className="space-y-3 bg-white rounded-2xl shadow p-6 card-hover">
      <label className="text-sm font-semibold text-gray-700">Text Editor (HTML) *</label>

      <div className="top-0 z-20 mt-1 flex flex-wrap gap-2 bg-gradient-to-r from-purple-100 to-blue-50 p-2 rounded-xl border border-gray-200 mb-2 shadow-md">
        <button type="button" className={`px-2 py-1 rounded ${editor.isActive("bold") ? "bg-purple-300" : "bg-purple-200"}`} onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button type="button" className={`px-2 py-1 rounded ${editor.isActive("italic") ? "bg-purple-300" : "bg-purple-200"}`} onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button type="button" className={`px-2 py-1 rounded ${editor.isActive("underline") ? "bg-purple-300" : "bg-purple-200"}`} onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
        <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" className="px-2 py-1 bg-purple-200 rounded" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button type="button" className="px-2 py-1 bg-purple-200 rounded" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className="px-2 py-1 bg-purple-200 rounded" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" className="px-2 py-1 bg-purple-200 rounded" onClick={() => editor.chain().focus().setParagraph().run()}>P</button>
        <button type="button" className="px-2 py-1 bg-purple-200 rounded" onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button type="button" className="px-2 py-1 bg-purple-200 rounded" onClick={() => { const url = prompt("Enter URL", "https://") || ""; if (url) editor.chain().focus().setLink({ href: url }).run(); }}>Link</button>
        <button type="button" className="px-2 py-1 bg-red-400 hover:bg-red-500 text-xs font-medium rounded text-white" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Clear</button>
        <span className="ml-auto text-xs text-gray-500">{wordCount} words</span>
      </div>

      <div>
        <EditorContent editor={editor} />
      </div>

      {/* Scoped content styles to ensure lists/headings render visibly in the editor */}
      <style jsx>{`
        :global(.prose ul) { list-style: disc; padding-left: 1.25rem; }
        :global(.prose ol) { list-style: decimal; padding-left: 1.25rem; }
        :global(.prose h1) { font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; margin: 0.75rem 0; }
        :global(.prose h2) { font-size: 1.5rem; line-height: 2rem; font-weight: 700; margin: 0.5rem 0; }
        :global(.prose h3) { font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; margin: 0.5rem 0; }
        :global(.prose blockquote) { border-left: 4px solid #d1d5db; padding-left: 0.75rem; color: #4b5563; }
        :global(.prose a) { color: #3b82f6; text-decoration: underline; }
        :global(.prose p) { margin: 0.5rem 0; }
      `}</style>

      {showPreview && (
        <div className="rounded-xl border border-gray-300 p-4 bg-white shadow-md mt-3">
          <div className="text-sm text-gray-500 mb-2">Live Preview</div>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      )}
    </div>
  );
}
