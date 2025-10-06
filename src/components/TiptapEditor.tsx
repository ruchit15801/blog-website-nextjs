"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";

export default function TiptapEditor() {
  const [contentHtml, setContentHtml] = useState("<p>Type your content here...</p>");
  const [showPreview, setShowPreview] = useState(true);
  const [message, setMessage] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
    content: contentHtml,
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] mt-3 rounded-2xl p-6 border-2 border-gray-300 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-inner focus:outline-none overflow-auto transition-all duration-300 hover:shadow-lg",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      setContentHtml(editor.getHTML());
      setWordCount(editor.getText().trim().split(/\s+/).filter(Boolean).length);
    };

    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="space-y-3 bg-white rounded-2xl shadow p-6 card-hover">
      <label className="text-sm font-semibold text-gray-700">
        Content (HTML) *
      </label>

      {/* Toolbar */}
      <div className="top-0 z-20 mt-1 flex flex-wrap gap-2 bg-gradient-to-r from-purple-100 to-blue-50 p-2 rounded-xl border border-gray-200 mb-2 shadow-md">
        <button
          type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-purple-300" : "bg-purple-200"
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("italic") ? "bg-purple-300" : "bg-purple-200"
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("underline") ? "bg-purple-300" : "bg-purple-200"
          }`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-purple-200 hover:bg-purple-300 text-xs font-medium rounded transition"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-purple-200 rounded"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-purple-200 rounded"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-purple-200 rounded"
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-purple-200 rounded"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-purple-200 rounded"
          onClick={() => {
            const url = prompt("Enter URL", "https://") || "";
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Link
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-red-400 hover:bg-red-500 text-xs font-medium rounded text-white"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Clear
        </button>

        <span className="ml-auto text-xs text-gray-500">{wordCount} words</span>
      </div>

      {/* Editable area */}
      <div>
        <EditorContent editor={editor} />
      </div>

      {/* Live Preview */}
      {showPreview && (
        <div className="rounded-xl border border-gray-300 p-4 bg-white shadow-md mt-3">
          <div className="text-sm text-gray-500 mb-2">Live Preview</div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`text-sm ${
            message.startsWith("Post created") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
  