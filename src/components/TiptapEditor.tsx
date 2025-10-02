"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";

export default function TiptapEditor() {

    const [contentHtml, setContentHtml] = useState("<p>Type your content here...</p>");

    const editor = useEditor({
        extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
        content: contentHtml,
        editorProps: {
            attributes: { class: "min-h-[250px] p-3 focus:outline-none" },
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (!editor) return;

        const update = () => setContentHtml(editor.getHTML());
        editor.on("update", update);

        // Cleanup
        return () => {
            editor.off("update", update);
        };
    }, [editor]);


    if (!editor) return null;

    return (
        <div className="space-y-4 bg-white rounded-xl shadow p-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 border p-2 rounded mb-2">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded ${editor.isActive("bold") ? "bg-purple-300" : "bg-gray-200"}`}>Bold</button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded ${editor.isActive("italic") ? "bg-purple-300" : "bg-gray-200"}`}>Italic</button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded ${editor.isActive("underline") ? "bg-purple-300" : "bg-gray-200"}`}>Underline</button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 bg-gray-200 rounded">• List</button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 bg-gray-200 rounded">1. List</button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 bg-gray-200 rounded">H2</button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="px-2 py-1 bg-gray-200 rounded">H3</button>
                <button onClick={() => editor.chain().focus().setParagraph().run()} className="px-2 py-1 bg-gray-200 rounded">P</button>
                <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="px-2 py-1 bg-gray-200 rounded">Quote</button>
                <button onClick={() => {
                    const url = prompt("Enter URL") || "";
                    editor.chain().focus().setLink({ href: url }).run();
                }} className="px-2 py-1 bg-gray-200 rounded">Link</button>
                <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className="px-2 py-1 bg-red-400 text-white rounded">Clear</button>
            </div>

            {/* Editable Area */}
            <div className="border rounded-lg min-h-[250px] p-3">
                <EditorContent editor={editor} />
            </div>

            {/* Live Preview */}
            <div className="border rounded-lg p-3 bg-gray-50">
                <div className="text-sm text-gray-500 mb-2">Live Preview</div>
                {contentHtml && <div dangerouslySetInnerHTML={{ __html: contentHtml }} />}
            </div>
        </div>
    );
}
