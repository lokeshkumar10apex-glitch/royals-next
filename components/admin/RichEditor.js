"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Youtube } from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { useCallback, useState, useEffect, useRef } from "react";

import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough,
  FaListUl, FaListOl, FaQuoteRight, FaLink, FaUnlink,
  FaImage, FaYoutube, FaAlignLeft, FaAlignCenter,
  FaAlignRight, FaAlignJustify, FaHighlighter,
  FaUndo, FaRedo, FaMinus, FaCode,
  FaSubscript, FaSuperscript, FaListAlt,
} from "react-icons/fa";

/* ── WordPress Keyboard Shortcuts ───────────────────
   Alt+Shift+1-6 = H1–H6
   Alt+Shift+L/C/R/J = Align Left/Center/Right/Justify
   Alt+Shift+D   = Strikethrough
   Alt+Shift+H   = Highlight
   Alt+Shift+O   = Ordered List
   Alt+Shift+U   = Unordered List
   Alt+Shift+Q   = Blockquote
   Alt+Shift+X   = Clear formatting
   Ctrl+K        = Insert Link
   Ctrl+B/I/U    = Bold/Italic/Underline (built-in)
   Ctrl+Z/Y      = Undo/Redo (built-in)
   Ctrl+E        = Inline Code
   Ctrl+Shift+C  = Code Block
   Ctrl+Shift+H  = Highlight
──────────────────────────────────────────────────── */
const WordPressShortcuts = Extension.create({
  name: "wordPressShortcuts",
  addKeyboardShortcuts() {
    return {
      // Headings H1–H6
      "Alt-Shift-1": () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      "Alt-Shift-2": () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      "Alt-Shift-3": () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      "Alt-Shift-4": () => this.editor.chain().focus().toggleHeading({ level: 4 }).run(),
      "Alt-Shift-5": () => this.editor.chain().focus().toggleHeading({ level: 5 }).run(),
      "Alt-Shift-6": () => this.editor.chain().focus().toggleHeading({ level: 6 }).run(),
      // Ctrl+1–6 bonus
      "Mod-1": () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      "Mod-2": () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      "Mod-3": () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      "Mod-4": () => this.editor.chain().focus().toggleHeading({ level: 4 }).run(),
      "Mod-5": () => this.editor.chain().focus().toggleHeading({ level: 5 }).run(),
      "Mod-6": () => this.editor.chain().focus().toggleHeading({ level: 6 }).run(),

      // Alignment
      "Alt-Shift-l": () => this.editor.chain().focus().setTextAlign("left").run(),
      "Alt-Shift-c": () => this.editor.chain().focus().setTextAlign("center").run(),
      "Alt-Shift-r": () => this.editor.chain().focus().setTextAlign("right").run(),
      "Alt-Shift-j": () => this.editor.chain().focus().setTextAlign("justify").run(),

      // Formatting
      "Alt-Shift-d": () => this.editor.chain().focus().toggleStrike().run(),
      "Alt-Shift-h": () => this.editor.chain().focus().toggleHighlight().run(),
      "Alt-Shift-x": () => this.editor.chain().focus().unsetAllMarks().clearNodes().run(),

      // Lists & Blocks
      "Alt-Shift-o": () => this.editor.chain().focus().toggleOrderedList().run(),
      "Alt-Shift-u": () => this.editor.chain().focus().toggleBulletList().run(),
      "Alt-Shift-q": () => this.editor.chain().focus().toggleBlockquote().run(),

      // Link (Ctrl+K)
      "Mod-k": () => {
        window.dispatchEvent(new CustomEvent("tiptap-open-link"));
        return true;
      },

      // Extra
      "Mod-Shift-h": () => this.editor.chain().focus().toggleHighlight().run(),
      "Mod-Shift-c": () => this.editor.chain().focus().toggleCodeBlock().run(),
      "Mod-e":       () => this.editor.chain().focus().toggleCode().run(),
    };
  },
});

/* ── Styles ─────────────────────────────────────── */
const toolbarBtn = (active) => ({
  background: active ? "rgba(201,162,39,0.25)" : "rgba(245,230,211,0.06)",
  border: `1px solid ${active ? "rgba(201,162,39,0.6)" : "rgba(201,162,39,0.15)"}`,
  color: active ? "#C9A227" : "#F5E6D3",
  borderRadius: "8px",
  padding: "6px 8px",
  cursor: "pointer",
  transition: "all 0.15s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
});

const divider = {
  width: "1px",
  height: "24px",
  background: "rgba(201,162,39,0.15)",
  margin: "0 4px",
  alignSelf: "center",
  flexShrink: 0,
};

/* ── Toolbar Button ──────────────────────────────── */
function Btn({ onClick, active, title, children, disabled }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      style={toolbarBtn(active)}
      title={title}
      disabled={disabled}
      aria-label={title}
    >
      {children}
    </button>
  );
}

/* ── Main Editor ─────────────────────────────────── */
export default function RichEditor({ value, onChange }) {
  const [linkUrl, setLinkUrl]   = useState("");
  const [showLink, setShowLink] = useState(false);
  const [imgUrl, setImgUrl]     = useState("");
  const [showImg, setShowImg]   = useState(false);
  const [ytUrl, setYtUrl]       = useState("");
  const [showYt, setShowYt]     = useState(false);
  const [codeView, setCodeView] = useState(false);  // Visual / Code toggle
  const [rawHtml, setRawHtml]   = useState("");     // raw HTML in code view
  const [showColor, setShowColor] = useState(false); // Font color picker
  const colorRef = useRef(null);

  const editor = useEditor({
    extensions: [
      // H1–H6 all levels enabled
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing your blog post here…\n\nTip: Select text to format it. Use ## for headings.",
      }),
      CharacterCount,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ allowBase64: false, HTMLAttributes: { class: "blog-img" } }),
      Youtube.configure({ controls: true, nocookie: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      TaskList,
      TaskItem.configure({ nested: true }),
      WordPressShortcuts,
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: { class: "tiptap-editor", spellcheck: "true" },
    },
  });

  // Sync async-loaded content into editor (edit mode)
  useEffect(() => {
    if (!editor) return;
    if (value && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  // Ctrl+K → open link popup
  useEffect(() => {
    const handler = () => { setShowLink(true); setShowImg(false); setShowYt(false); };
    window.addEventListener("tiptap-open-link", handler);
    return () => window.removeEventListener("tiptap-open-link", handler);
  }, []);

  /* Handlers */
  const setLink = useCallback(() => {
    if (!linkUrl) return;
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().extendMarkToLink({ href: url }).setLink({ href: url }).run();
    setLinkUrl(""); setShowLink(false);
  }, [editor, linkUrl]);

  const removeLink  = () => editor.chain().focus().unsetLink().run();
  const insertImage = () => {
    if (!imgUrl) return;
    editor.chain().focus().setImage({ src: imgUrl, alt: "Blog image" }).run();
    setImgUrl(""); setShowImg(false);
  };
  const insertYoutube = () => {
    if (!ytUrl) return;
    editor.commands.setYoutubeVideo({ src: ytUrl, width: 640, height: 360 });
    setYtUrl(""); setShowYt(false);
  };

  // Switch to Code view — capture current HTML, pretty-print it
  const switchToCode = () => {
    const html = editor.getHTML();

    const formatted = html
      // Add newline before every opening block tag
      .replace(/(<(p|h[1-6]|ul|ol|li|blockquote|pre|div|figure|figcaption)(\s[^>]*)?>) */gi, "\n$1")
      // Add newline + blank line after every closing block tag
      .replace(/<\/(p|h[1-6]|ul|ol|li|blockquote|pre|div|figure|figcaption)>/gi, "</$1>\n")
      // Add newline for void tags
      .replace(/(<(br|hr|img)([^>]*)\/?>)/gi, "\n$1\n")
      // Clean up
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      // Add blank line after each closing block tag line
      .reduce((acc, line) => {
        acc.push(line);
        if (/<\/(p|h[1-6]|ul|ol|blockquote|pre|div|figure)>/i.test(line)) {
          acc.push(""); // blank separator line
        }
        return acc;
      }, [])
      .join("\n");

    setRawHtml(formatted);
    setCodeView(true);
  };

  // Switch back to Visual — push edited HTML into editor
  const switchToVisual = () => {
    editor.commands.setContent(rawHtml, false);
    onChange(rawHtml);
    setCodeView(false);
  };

  if (!editor) return null;

  const words = editor.storage.characterCount?.words() ?? 0;
  const chars = editor.storage.characterCount?.characters() ?? 0;

  return (
    <div style={{ border: "1px solid rgba(201,162,39,0.25)", borderRadius: "16px", background: "rgba(245,230,211,0.03)", position: "relative" }}>

      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex", flexWrap: "wrap", gap: "4px", padding: "10px 12px",
          borderBottom: "1px solid rgba(201,162,39,0.15)",
          background: "rgba(26,10,10,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          position: "sticky", top: "0px", zIndex: 40,
          borderRadius: "16px 16px 0 0",
          opacity: codeView ? 0.4 : 1,
          pointerEvents: codeView ? "none" : "auto",
        }}
      >
        {/* restore pointer-events for just the toggle */}
        <style>{`.visual-code-toggle { pointer-events: auto !important; opacity: 1 !important; }`}</style>
        {/* History */}
        <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)" disabled={!editor.can().undo()}><FaUndo size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Y)" disabled={!editor.can().redo()}><FaRedo size={12} /></Btn>

        <div style={divider} />

        {/* Heading Dropdown — WordPress style */}
        <select
          value={
            editor.isActive("heading", { level: 1 }) ? "h1" :
            editor.isActive("heading", { level: 2 }) ? "h2" :
            editor.isActive("heading", { level: 3 }) ? "h3" :
            editor.isActive("heading", { level: 4 }) ? "h4" :
            editor.isActive("heading", { level: 5 }) ? "h5" :
            editor.isActive("heading", { level: 6 }) ? "h6" :
            editor.isActive("codeBlock")             ? "pre" :
            "p"
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p")   editor.chain().focus().setParagraph().run();
            else if (val === "pre") editor.chain().focus().toggleCodeBlock().run();
            else editor.chain().focus().toggleHeading({ level: Number(val.replace("h", "")) }).run();
          }}
          style={{
            background: "rgba(245,230,211,0.06)",
            border: "1px solid rgba(201,162,39,0.2)",
            color: "#F5E6D3",
            borderRadius: "8px",
            padding: "5px 8px",
            fontSize: "13px",
            cursor: "pointer",
            outline: "none",
            height: "32px",
            minWidth: "130px",
          }}
        >
          <option value="p"   style={{ background: "#1A0A0A", fontWeight: 400 }}>Paragraph</option>
          <option value="h1"  style={{ background: "#1A0A0A", fontWeight: 800, fontSize: "1.4em" }}>Heading 1</option>
          <option value="h2"  style={{ background: "#1A0A0A", fontWeight: 700, fontSize: "1.2em" }}>Heading 2</option>
          <option value="h3"  style={{ background: "#1A0A0A", fontWeight: 600 }}>Heading 3</option>
          <option value="h4"  style={{ background: "#1A0A0A", fontWeight: 600 }}>Heading 4</option>
          <option value="h5"  style={{ background: "#1A0A0A", fontWeight: 600 }}>Heading 5</option>
          <option value="h6"  style={{ background: "#1A0A0A", fontWeight: 600 }}>Heading 6</option>
          <option value="pre" style={{ background: "#1A0A0A", fontFamily: "monospace" }}>Preformatted</option>
        </select>

        <div style={divider} />

        {/* Inline formatting */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive("bold")}      title="Bold (Ctrl+B)"><FaBold size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive("italic")}    title="Italic (Ctrl+I)"><FaItalic size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)"><FaUnderline size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()}    active={editor.isActive("strike")}    title="Strikethrough (Alt+Shift+D)"><FaStrikethrough size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight (Alt+Shift+H)"><FaHighlighter size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCode().run()}      active={editor.isActive("code")}      title="Inline Code (Ctrl+E)"><FaCode size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleSubscript().run()}   active={editor.isActive("subscript")}   title="Subscript"><FaSubscript size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} title="Superscript"><FaSuperscript size={12} /></Btn>

        {/* Font Color */}
        <div style={{ position: "relative", display: "inline-flex" }}>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setShowColor(s => !s); }}
            style={{
              ...toolbarBtn(showColor),
              gap: "3px", flexDirection: "column", padding: "4px 6px",
            }}
            title="Font Color"
          >
            <span style={{ fontSize: "11px", fontWeight: 700, lineHeight: 1 }}>A</span>
            <span style={{
              width: "14px", height: "3px", borderRadius: "2px",
              background: editor.getAttributes("textStyle").color || "#C9A227",
            }} />
          </button>
          {showColor && (
            <div ref={colorRef} style={{
              position: "absolute", top: "36px", left: 0, zIndex: 100,
              background: "#1A0A0A", border: "1px solid rgba(201,162,39,0.3)",
              borderRadius: "10px", padding: "10px", display: "flex",
              flexWrap: "wrap", gap: "6px", width: "172px",
            }}>
              {["#FFFFF0","#F5E6D3","#C9A227","#800020","#ffffff","#000000",
                "#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6",
                "#ec4899","#14b8a6","#64748b","#92400e"].map(color => (
                <button
                  key={color}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor(color).run();
                    setShowColor(false);
                  }}
                  style={{
                    width: "22px", height: "22px", borderRadius: "4px",
                    background: color, border: "1px solid rgba(255,255,255,0.15)",
                    cursor: "pointer",
                  }}
                  title={color}
                />
              ))}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); setShowColor(false); }}
                style={{ ...toolbarBtn(false), fontSize: "10px", padding: "3px 7px", width: "100%" }}
              >
                Reset Color
              </button>
            </div>
          )}
        </div>

        <div style={divider} />

        {/* Alignment */}
        <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()}    active={editor.isActive({ textAlign: "left" })}    title="Align Left (Alt+Shift+L)"><FaAlignLeft size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()}  active={editor.isActive({ textAlign: "center" })}  title="Align Center (Alt+Shift+C)"><FaAlignCenter size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()}   active={editor.isActive({ textAlign: "right" })}   title="Align Right (Alt+Shift+R)"><FaAlignRight size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify (Alt+Shift+J)"><FaAlignJustify size={12} /></Btn>

        <div style={divider} />

        {/* Lists & Blocks */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive("bulletList")}  title="Bullet List (Alt+Shift+U)"><FaListUl size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List (Alt+Shift+O)"><FaListOl size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleTaskList().run()}    active={editor.isActive("taskList")}    title="Task List (Checklist)"><FaListAlt size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()}  active={editor.isActive("blockquote")}  title="Blockquote (Alt+Shift+Q)"><FaQuoteRight size={12} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()}   active={editor.isActive("codeBlock")}   title="Code Block (Ctrl+Shift+C)">
          <span style={{ fontSize: "11px", fontWeight: 700 }}>{`<>`}</span>
        </Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Horizontal Line"><FaMinus size={12} /></Btn>

        <div style={divider} />

        {/* Link */}
        <Btn onClick={() => { setShowLink((s) => !s); setShowImg(false); setShowYt(false); }} active={editor.isActive("link") || showLink} title="Add Link (Ctrl+K)"><FaLink size={12} /></Btn>
        <Btn onClick={removeLink} active={false} title="Remove Link" disabled={!editor.isActive("link")}><FaUnlink size={12} /></Btn>

        {/* Image */}
        <Btn onClick={() => { setShowImg((s) => !s); setShowLink(false); setShowYt(false); }} active={showImg} title="Insert Image"><FaImage size={12} /></Btn>

        {/* YouTube */}
        <Btn onClick={() => { setShowYt((s) => !s); setShowLink(false); setShowImg(false); }} active={showYt} title="Embed YouTube"><FaYoutube size={12} /></Btn>

        {/* Table */}
        <div style={divider} />
        <Btn
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          active={editor.isActive("table")}
          title="Insert Table"
        >
          <span style={{ fontSize: "11px", fontWeight: 700 }}>⊞</span>
        </Btn>
        <Btn onClick={() => editor.chain().focus().addColumnAfter().run()}  title="Add Column"  disabled={!editor.isActive("table")}><span style={{ fontSize: "10px" }}>+Col</span></Btn>
        <Btn onClick={() => editor.chain().focus().addRowAfter().run()}     title="Add Row"     disabled={!editor.isActive("table")}><span style={{ fontSize: "10px" }}>+Row</span></Btn>
        <Btn onClick={() => editor.chain().focus().deleteColumn().run()}    title="Delete Column" disabled={!editor.isActive("table")}><span style={{ fontSize: "10px" }}>-Col</span></Btn>
        <Btn onClick={() => editor.chain().focus().deleteRow().run()}       title="Delete Row"    disabled={!editor.isActive("table")}><span style={{ fontSize: "10px" }}>-Row</span></Btn>
        <Btn onClick={() => editor.chain().focus().deleteTable().run()}     title="Delete Table"  disabled={!editor.isActive("table")}><span style={{ fontSize: "10px", color: "#f87171" }}>✕Tbl</span></Btn>

        {/* ── Visual / Code toggle (WordPress style) ── */}
        <div className="visual-code-toggle" style={{ marginLeft: "auto", display: "flex", gap: "2px", pointerEvents: "auto", opacity: 1 }}>
          <button
            type="button"
            onClick={switchToVisual}
            style={{
              ...toolbarBtn(!codeView),
              borderRadius: "6px 0 0 6px",
              fontSize: "12px",
              fontWeight: 600,
              padding: "5px 12px",
            }}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={switchToCode}
            style={{
              ...toolbarBtn(codeView),
              borderRadius: "0 6px 6px 0",
              fontSize: "12px",
              fontWeight: 600,
              padding: "5px 12px",
            }}
          >
            Code
          </button>
        </div>
      </div>

      {/* ── Inline Popups ── */}
      {showLink && (
        <div style={{ display: "flex", gap: "8px", padding: "10px 12px", background: "rgba(26,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,162,39,0.15)", position: "sticky", top: "44px", zIndex: 39 }}>
          <input autoFocus value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setLink()}
            placeholder="https://example.com"
            style={{ flex: 1, background: "rgba(245,230,211,0.07)", border: "1px solid rgba(201,162,39,0.25)", color: "#F5E6D3", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", outline: "none" }} />
          <button type="button" onClick={setLink}            style={{ ...toolbarBtn(true),  padding: "6px 14px", fontSize: "12px", fontWeight: 600 }}>Add</button>
          <button type="button" onClick={() => setShowLink(false)} style={{ ...toolbarBtn(false), padding: "6px 10px" }}>✕</button>
        </div>
      )}
      {showImg && (
        <div style={{ display: "flex", gap: "8px", padding: "10px 12px", background: "rgba(26,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,162,39,0.15)", position: "sticky", top: "44px", zIndex: 39 }}>
          <input autoFocus value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && insertImage()}
            placeholder="https://images.unsplash.com/photo-xxx?w=800"
            style={{ flex: 1, background: "rgba(245,230,211,0.07)", border: "1px solid rgba(201,162,39,0.25)", color: "#F5E6D3", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", outline: "none" }} />
          <button type="button" onClick={insertImage}        style={{ ...toolbarBtn(true),  padding: "6px 14px", fontSize: "12px", fontWeight: 600 }}>Insert</button>
          <button type="button" onClick={() => setShowImg(false)}  style={{ ...toolbarBtn(false), padding: "6px 10px" }}>✕</button>
        </div>
      )}
      {showYt && (
        <div style={{ display: "flex", gap: "8px", padding: "10px 12px", background: "rgba(26,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,162,39,0.15)", position: "sticky", top: "44px", zIndex: 39 }}>
          <input autoFocus value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && insertYoutube()}
            placeholder="https://www.youtube.com/watch?v=..."
            style={{ flex: 1, background: "rgba(245,230,211,0.07)", border: "1px solid rgba(201,162,39,0.25)", color: "#F5E6D3", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", outline: "none" }} />
          <button type="button" onClick={insertYoutube}      style={{ ...toolbarBtn(true),  padding: "6px 14px", fontSize: "12px", fontWeight: 600 }}>Embed</button>
          <button type="button" onClick={() => setShowYt(false)}   style={{ ...toolbarBtn(false), padding: "6px 10px" }}>✕</button>
        </div>
      )}

      {/* ── Editor Area ── */}
      {codeView ? (
        // Code view — pretty-printed HTML textarea
        <textarea
          value={rawHtml}
          onChange={(e) => setRawHtml(e.target.value)}
          spellCheck={false}
          style={{
            width: "100%",
            minHeight: "420px",
            padding: "20px 24px",
            background: "rgba(0,0,0,0.3)",
            color: "#C9A227",
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "13px",
            lineHeight: "1.9",
            outline: "none",
            border: "none",
            resize: "vertical",
            boxSizing: "border-box",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowX: "hidden",
            tabSize: 2,
          }}
        />
      ) : (
        // Visual view — TipTap rich editor
        <EditorContent editor={editor} />
      )}

      {/* ── Word / Char Count ── */}
      <div style={{ padding: "6px 14px", borderTop: "1px solid rgba(201,162,39,0.1)", display: "flex", gap: "16px", fontSize: "11px", color: "#F5E6D3", opacity: 0.4 }}>
        {codeView ? (
          <span>{rawHtml.length} characters (HTML)</span>
        ) : (
          <>
            <span>{words} words</span>
            <span>{chars} characters</span>
          </>
        )}
      </div>

      {/* ── Editor CSS ── */}
      <style>{`
        .tiptap-editor {
          min-height: 420px;
          padding: 20px 24px;
          outline: none;
          color: #F5E6D3;
          font-size: 14px;
          line-height: 1.8;
        }
        .tiptap-editor h1 { color: #FFFFF0; font-family: Georgia, serif; font-size: 2rem;   font-weight: 800; margin: 1.5rem 0 0.75rem; }
        .tiptap-editor h2 { color: #FFFFF0; font-family: Georgia, serif; font-size: 1.6rem;  font-weight: 700; margin: 1.25rem 0 0.6rem; border-bottom: 1px solid rgba(201,162,39,0.2); padding-bottom: 6px; }
        .tiptap-editor h3 { color: #C9A227; font-family: Georgia, serif; font-size: 1.3rem;  font-weight: 600; margin: 1rem 0 0.5rem; }
        .tiptap-editor h4 { color: #F5E6D3; font-size: 1.1rem;  font-weight: 600; margin: 0.9rem 0 0.45rem; opacity: 0.95; }
        .tiptap-editor h5 { color: #F5E6D3; font-size: 1rem;    font-weight: 600; margin: 0.8rem 0 0.4rem;  opacity: 0.85; letter-spacing: 0.03em; }
        .tiptap-editor h6 { color: #F5E6D3; font-size: 0.9rem;  font-weight: 600; margin: 0.75rem 0 0.35rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.08em; }
        .tiptap-editor p  { margin-bottom: 0.85rem; opacity: 0.87; }
        .tiptap-editor strong { color: #FFFFF0; font-weight: 700; }
        .tiptap-editor em { font-style: italic; }
        .tiptap-editor u  { text-decoration: underline; }
        .tiptap-editor s  { text-decoration: line-through; opacity: 0.6; }
        .tiptap-editor mark { background: rgba(201,162,39,0.3); color: #FFFFF0; border-radius: 3px; padding: 0 3px; }
        .tiptap-editor code { background: rgba(201,162,39,0.12); color: #C9A227; border-radius: 4px; padding: 2px 6px; font-size: 0.85em; font-family: monospace; }
        .tiptap-editor pre  { background: rgba(245,230,211,0.06); border: 1px solid rgba(201,162,39,0.2); border-radius: 10px; padding: 14px 18px; overflow-x: auto; margin: 1rem 0; }
        .tiptap-editor pre code { background: none; color: #F5E6D3; padding: 0; }
        .tiptap-editor ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 0.85rem; }
        .tiptap-editor ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 0.85rem; }
        .tiptap-editor li { margin-bottom: 0.3rem; opacity: 0.85; }
        .tiptap-editor blockquote { border-left: 3px solid #C9A227; padding-left: 1rem; margin: 1rem 0; font-style: italic; opacity: 0.8; }
        .tiptap-editor hr  { border: none; border-top: 1px solid rgba(201,162,39,0.25); margin: 1.5rem 0; }
        .tiptap-editor a   { color: #C9A227; text-decoration: underline; }
        .tiptap-editor img { max-width: 100%; border-radius: 12px; margin: 1rem 0; border: 1px solid rgba(201,162,39,0.2); }
        .tiptap-editor iframe { width: 100%; aspect-ratio: 16/9; border-radius: 12px; margin: 1rem 0; }
        .tiptap-editor table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: 14px; }
        .tiptap-editor th { background: rgba(201,162,39,0.15); color: #FFFFF0; font-weight: 700; text-align: left; padding: 10px 14px; border: 1px solid rgba(201,162,39,0.3); }
        .tiptap-editor td { color: #F5E6D3; padding: 9px 14px; border: 1px solid rgba(201,162,39,0.15); vertical-align: top; }
        .tiptap-editor tr:nth-child(even) td { background: rgba(245,230,211,0.03); }
        .tiptap-editor .selectedCell { background: rgba(201,162,39,0.15) !important; }
        .tiptap-editor sub { font-size: 0.75em; vertical-align: sub; }
        .tiptap-editor sup { font-size: 0.75em; vertical-align: super; }
        .tiptap-editor ul[data-type="taskList"] { list-style: none; padding-left: 0.5rem; }
        .tiptap-editor ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 0.4rem; }
        .tiptap-editor ul[data-type="taskList"] li > label { margin-top: 2px; flex-shrink: 0; }
        .tiptap-editor ul[data-type="taskList"] li > label input[type="checkbox"] { width: 15px; height: 15px; accent-color: #C9A227; cursor: pointer; }
        .tiptap-editor ul[data-type="taskList"] li[data-checked="true"] > div { opacity: 0.5; text-decoration: line-through; }
        .tiptap-editor .is-editor-empty:first-child::before { content: attr(data-placeholder); color: rgba(245,230,211,0.25); pointer-events: none; float: left; height: 0; }
        .tiptap-editor p.is-empty::before { content: attr(data-placeholder); color: rgba(245,230,211,0.25); pointer-events: none; float: left; height: 0; }
        .tiptap-editor [data-text-align="center"]  { text-align: center; }
        .tiptap-editor [data-text-align="right"]   { text-align: right; }
        .tiptap-editor [data-text-align="justify"] { text-align: justify; }
      `}</style>
    </div>
  );
}
