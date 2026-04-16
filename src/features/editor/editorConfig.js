/**
 * Monaco editor configuration.
 * Theme definition and language support setup.
 */

import * as monaco from "monaco-editor";

export const configureMonaco = () => {
  // Visual Studio Code Dark+ Theme
  monaco.editor.defineTheme("community-material", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "D4D4D4", background: "1a1a1a" },
      // Keywords (const, let, function, return, if, else) - Blue
      { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
      { token: "keyword.control", foreground: "C586C0" },
      { token: "keyword.operator", foreground: "D4D4D4" },
      // Storage/Declaration keywords
      { token: "storage.type", foreground: "569CD6", fontStyle: "bold" },
      { token: "storage.modifier", foreground: "569CD6", fontStyle: "bold" },
      // Variables/Identifiers - Light Blue
      { token: "variable", foreground: "9CDCFE" },
      { token: "variable.other", foreground: "D4D4D4" },
      { token: "variable.parameter", foreground: "9CDCFE" },
      { token: "variable.language", foreground: "569CD6" },
      { token: "identifier", foreground: "D4D4D4" },
      // Properties - Light Blue
      { token: "property", foreground: "9CDCFE" },
      // Functions - Yellow/Gold
      { token: "function", foreground: "DCDCAA" },
      { token: "function.name", foreground: "DCDCAA" },
      { token: "function.call", foreground: "DCDCAA" },
      { token: "support.function", foreground: "DCDCAA" },
      // Types/Classes - Green/Cyan
      { token: "type", foreground: "4EC9B0" },
      { token: "class", foreground: "4EC9B0", fontStyle: "bold" },
      { token: "interface", foreground: "4EC9B0" },
      { token: "support.class", foreground: "4EC9B0" },
      { token: "support.type", foreground: "4EC9B0" },
      // Strings - Orange
      { token: "string", foreground: "CE9178" },
      { token: "string.quoted", foreground: "CE9178" },
      { token: "string.template", foreground: "CE9178" },
      { token: "string.escape", foreground: "D7BA7D" },
      // String quotes
      { token: "string.quote", foreground: "CE9178" },
      // Numbers/Constants - Light Green
      { token: "number", foreground: "B5CEA8" },
      { token: "constant", foreground: "4FC1FF" },
      { token: "constant.numeric", foreground: "B5CEA8" },
      { token: "constant.language", foreground: "569CD6" },
      // Operators - White/Light Gray
      { token: "operator", foreground: "D4D4D4" },
      { token: "operator.comparison", foreground: "D4D4D4" },
      { token: "operator.assignment", foreground: "D4D4D4" },
      { token: "operator.arithmetic", foreground: "D4D4D4" },
      // Delimiters/Punctuation - White
      { token: "delimiter", foreground: "D4D4D4" },
      { token: "delimiter.bracket", foreground: "FFD700" },
      { token: "delimiter.parenthesis", foreground: "D4D4D4" },
      { token: "delimiter.curly", foreground: "FFD700" },
      { token: "delimiter.square", foreground: "D4D4D4" },
      { token: "punctuation", foreground: "D4D4D4" },
      // Braces/Parens - Yellow
      { token: "punctuation.brace.open", foreground: "FFD700" },
      { token: "punctuation.brace.close", foreground: "FFD700" },
      { token: "punctuation.parenthesis.open", foreground: "D4D4D4" },
      { token: "punctuation.parenthesis.close", foreground: "D4D4D4" },
      { token: "punctuation.square.open", foreground: "D4D4D4" },
      { token: "punctuation.square.close", foreground: "D4D4D4" },
      // Comments - Green
      { token: "comment", foreground: "6A9955" },
      { token: "comment.doc", foreground: "6A9955" },
      { token: "comment.line", foreground: "6A9955" },
      { token: "comment.block", foreground: "6A9955" },
      // Module/Namespace - Cyan
      { token: "namespace", foreground: "4EC9B0" },
      { token: "module", foreground: "4EC9B0" },
      // Tag/Attribute (HTML/JSX) - Blue/Blue
      { token: "tag", foreground: "569CD6" },
      { token: "tag.name", foreground: "569CD6" },
      { token: "attribute.name", foreground: "9CDCFE" },
      { token: "attribute.value", foreground: "CE9178" },
      // Meta/Annotations - Yellow
      { token: "meta.decorator", foreground: "4EC9B0" },
      { token: "meta.annotation", foreground: "4EC9B0" },
      // Regular expressions - Red/Orange
      { token: "regexp", foreground: "D16969" },
      // Special keywords
      { token: "this", foreground: "569CD6", fontStyle: "bold" },
      { token: "super", foreground: "569CD6", fontStyle: "bold" },
    ],
    colors: {
      "editor.background": "#1a1a1a",
      "editor.foreground": "#e0e0e0",
      "editorLineNumber.foreground": "#424242",
      "editorLineNumber.activeForeground": "#e0e0e0",
      "editor.selectionBackground": "#3d3d3d",
      "editor.inactiveSelectionBackground": "#2a2a2a",
      "editor.lineHighlightBackground": "#212121",
      "editor.lineHighlightBorder": "#2d2d2d",
      "editor.findMatchBackground": "#F78C6C66",
      "editor.findMatchHighlightBackground": "#C792EA66",
      "editorBracketMatch.background": "#2a2a2a",
      "editorBracketMatch.border": "#89DDFF",
      "editorGutter.background": "#1a1a1a",
      "editorGutter.modifiedBackground": "#82AAFF",
      "editorGutter.addedBackground": "#C3E88D",
      "editorGutter.deletedBackground": "#FF5370",
      "editorSuggestWidget.background": "#1a1a1a",
      "editorSuggestWidget.border": "#2d2d2d",
      "editorSuggestWidget.foreground": "#e0e0e0",
      "editorSuggestWidget.highlightForeground": "#82AAFF",
      "editorSuggestWidget.selectedBackground": "#3d3d3d",
    },
  });

  // Rust language config
  monaco.languages.setLanguageConfiguration("rust", {
    comments: { lineComment: "//", blockComment: ["/*", "*/"] },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    folding: {
      offSide: true,
      markers: {
        start: new RegExp("^\\s*//\\s*#?region\\b"),
        end: new RegExp("^\\s*//\\s*#?endregion\\b"),
      },
    },
  });

  // TOML language
  monaco.languages.register({ id: "toml" });
  monaco.languages.setLanguageConfiguration("toml", {
    comments: { lineComment: "#" },
    brackets: [
      ["{", "}"],
      ["[", "]"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });

  // Rust completions
  monaco.languages.registerCompletionItemProvider("rust", {
    provideCompletionItems: () => {
      const keywords = ["fn", "let", "mut", "const", "static", "struct", "enum", "trait", "impl", "match", "if", "else", "while", "for", "loop", "return", "pub", "use", "mod", "crate", "self", "super", "as", "move", "async", "await"];
      const types = ["String", "Vec", "Option", "Result", "Box", "Rc", "Arc"];
      const macros = ["println!", "format!", "vec!", "dbg!", "todo!", "panic!", "assert!", "assert_eq!"];

      const suggestions = [
        ...keywords.map((k) => ({
          label: k,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: `${k} `,
        })),
        ...types.map((t) => ({
          label: t,
          kind: monaco.languages.CompletionItemKind.Type,
          insertText: `${t}<>`,
        })),
        ...macros.map((m) => ({
          label: m,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: m.endsWith("!") ? `${m.slice(0, -1)}!($1)` : m,
        })),
      ];
      return { suggestions };
    },
  });

  // TOML completions
  monaco.languages.registerCompletionItemProvider("toml", {
    provideCompletionItems: () => {
      const suggestions = [
        { label: "[package]", kind: monaco.languages.CompletionItemKind.Snippet, insertText: '[package]\nname = "$1"\nversion = "0.1.0"\nedition = "2021"\n' },
        { label: "[dependencies]", kind: monaco.languages.CompletionItemKind.Snippet, insertText: '[dependencies]\n$1 = "$2"' },
        { label: "[dev-dependencies]", kind: monaco.languages.CompletionItemKind.Snippet, insertText: '[dev-dependencies]\n$1 = "$2"' },
      ];
      return { suggestions };
    },
  });

  // OLED Midnight Theme
  monaco.editor.defineTheme("community-midnight", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "FFFFFF", background: "000000" },
    ],
    colors: {
      "editor.background": "#000000",
      "editor.foreground": "#ffffff",
      "editorLineNumber.foreground": "#333333",
      "editorLineNumber.activeForeground": "#ffffff",
      "editor.selectionBackground": "#333333",
      "editor.inactiveSelectionBackground": "#111111",
      "editor.lineHighlightBackground": "#080808",
      "editor.lineHighlightBorder": "#111111",
      "editorGutter.background": "#000000",
      "editorSuggestWidget.background": "#000000",
    },
  });

  // Solarized Light Theme
  monaco.editor.defineTheme("community-solarized", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "", foreground: "586e75", background: "fdf6e3" },
      { token: "keyword", foreground: "859900", fontStyle: "bold" }, // Green instead of Cyan
      { token: "variable", foreground: "657b83" }, // Neutral instead of Blue
      { token: "function", foreground: "b58900" }, // Yellow
      { token: "string", foreground: "d33682" }, // Magenta
      { token: "number", foreground: "6c71c4" }, // Violet
      { token: "constant", foreground: "cb4b16" }, // Orange
      { token: "comment", foreground: "93a1a1", fontStyle: "italic" },
      { token: "type", foreground: "cb4b16" }, // Orange
      { token: "class", foreground: "cb4b16" },
      { token: "tag", foreground: "859900" },
    ],
    colors: {
      "editor.background": "#fdf6e3",
      "editor.foreground": "#586e75",
      "editorLineNumber.foreground": "#93a1a1",
      "editorLineNumber.activeForeground": "#586e75",
      "editor.selectionBackground": "#eee8d5",
      "editor.inactiveSelectionBackground": "#eee8d5",
      "editor.lineHighlightBackground": "#eee8d5",
      "editor.lineHighlightBorder": "#d5ceba",
      "editorGutter.background": "#eee8d5",
      "editorSuggestWidget.background": "#fdf6e3",
      "editorSuggestWidget.border": "#d5ceba",
    },
  });
};

// Run configuration immediately on import
configureMonaco();
