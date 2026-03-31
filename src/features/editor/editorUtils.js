/**
 * Editor utility functions.
 */

const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "ico"];

export const getFileType = (filePath) => {
  if (!filePath) return "code";
  const ext = filePath.split(".").pop()?.toLowerCase();
  if (IMAGE_EXTS.includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "code";
};

export const getLanguageFromName = (name) => {
  if (!name) return "plaintext";
  const ext = name.split(".").at(-1)?.toLowerCase();
  const map = {
    // Rust
    rs: "rust",
    toml: "toml",
    lock: "toml",
    // JavaScript/TypeScript
    js: "javascript",
    jsx: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    ts: "typescript",
    tsx: "typescript",
    mts: "typescript",
    // Web
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    vue: "html",
    svelte: "html",
    // Python
    py: "python",
    pyw: "python",
    pyc: "python",
    pyi: "python",
    // Shell/Bash
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    fish: "shell",
    ps1: "powershell",
    // Data formats
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    xml: "xml",
    csv: "plaintext",
    // Documentation
    md: "markdown",
    mdx: "markdown",
    txt: "plaintext",
    rst: "plaintext",
    // C-family
    c: "c",
    h: "c",
    cpp: "cpp",
    hpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    // C#
    cs: "csharp",
    // Java
    java: "java",
    // Go
    go: "go",
    // Ruby
    rb: "ruby",
    // PHP
    php: "php",
    phtml: "php",
    // Swift
    swift: "swift",
    // Kotlin
    kt: "kotlin",
    kts: "kotlin",
    // Scala
    scala: "scala",
    sc: "scala",
    // R
    r: "r",
    // Lua
    lua: "lua",
    // Perl
    pl: "perl",
    pm: "perl",
    // Haskell
    hs: "haskell",
    lhs: "haskell",
    // Clojure
    clj: "clojure",
    cljs: "clojure",
    edn: "clojure",
    // Elixir
    ex: "elixir",
    exs: "elixir",
    // Erlang
    erl: "erlang",
    // Dart
    dart: "dart",
    // F#
    fs: "fsharp",
    fsi: "fsharp",
    fsx: "fsharp",
    // Julia
    jl: "julia",
    // OCaml
    ml: "ocaml",
    mli: "ocaml",
    // Solidity
    sol: "solidity",
    // SQL
    sql: "sql",
    // GraphQL
    graphql: "graphql",
    gql: "graphql",
    // Docker
    dockerfile: "dockerfile",
    // Makefile
    makefile: "makefile",
    mk: "makefile",
    // Config files
    ini: "ini",
    cfg: "ini",
    conf: "ini",
    env: "dotenv",
    gitignore: "plaintext",
    // Git
    diff: "diff",
    patch: "diff",
    // Markdown variants
    markdown: "markdown",
    // Log files
    log: "log",
  };
  return map[ext] ?? "plaintext";
};

// Get display name for language
export const getLanguageDisplayName = (language) => {
  const displayNames = {
    rust: "Rust",
    toml: "TOML",
    javascript: "JavaScript",
    typescript: "TypeScript",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    sass: "Sass",
    less: "Less",
    python: "Python",
    shell: "Shell",
    powershell: "PowerShell",
    json: "JSON",
    yaml: "YAML",
    xml: "XML",
    markdown: "Markdown",
    plaintext: "Plain Text",
    c: "C",
    cpp: "C++",
    csharp: "C#",
    java: "Java",
    go: "Go",
    ruby: "Ruby",
    php: "PHP",
    swift: "Swift",
    kotlin: "Kotlin",
    scala: "Scala",
    r: "R",
    lua: "Lua",
    perl: "Perl",
    haskell: "Haskell",
    clojure: "Clojure",
    elixir: "Elixir",
    erlang: "Erlang",
    dart: "Dart",
    fsharp: "F#",
    julia: "Julia",
    ocaml: "OCaml",
    solidity: "Solidity",
    sql: "SQL",
    graphql: "GraphQL",
    dockerfile: "Dockerfile",
    makefile: "Makefile",
    ini: "INI",
    dotenv: "Env",
    diff: "Diff",
    log: "Log",
  };
  return displayNames[language] || language.charAt(0).toUpperCase() + language.slice(1);
};
