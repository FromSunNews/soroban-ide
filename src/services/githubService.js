/**
 * GitHub API service for fetching repository contents
 * Provides clean interface for cloning repositories
 */

const GITHUB_API_BASE = "https://api.github.com";

/**
 * Parse GitHub URL to extract owner and repo name
 * @param {string} url - GitHub URL (e.g., https://github.com/owner/repo.git)
 * @returns {{owner: string, repo: string} | null}
 */
export const parseGithubUrl = (url) => {
  // Handle various GitHub URL formats
  const patterns = [/^https:\/\/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?\/?$/, /^git@github\.com:([^\/]+)\/([^\/]+?)\.git$/, /^github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?\/?$/, /^([^\/]+)\/([^\/]+?)$/];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }

  return null;
};

/**
 * Fetch repository contents from GitHub API
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - Path within repository (default: root)
 * @returns {Promise<Array>} - Array of file/directory objects
 */
export const fetchRepoContents = async (owner, repo, path = "") => {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Rate limit exceeded. Please try again later or use a personal access token.");
    }
    if (response.status === 404) {
      throw new Error("Repository not found. Please check the URL.");
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
};

/**
 * Fetch raw file content from GitHub
 * @param {string} downloadUrl - Raw file URL from GitHub
 * @param {boolean} isBinary - Whether the file is binary (image, pdf, etc.)
 * @returns {Promise<string>} - File content (text or base64 for binary)
 */
export const fetchFileContent = async (downloadUrl, isBinary = false) => {
  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  if (isBinary) {
    // For binary files, read as array buffer and convert to base64
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  return response.text();
};

/**
 * Check if a file is binary based on extension
 * @param {string} filename - File name
 * @returns {boolean}
 */
const isBinaryFile = (filename) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "ico", "pdf", "zip", "tar", "gz", "exe", "dll"].includes(ext);
};

/**
 * Recursive function to build repository tree structure
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - Current path
 * @param {Function} uniqueId - ID generator function
 * @returns {Promise<{nodes: Array, contents: Object}>}
 */
const buildRepoTreeRecursive = async (owner, repo, path, uniqueId) => {
  const nodes = [];
  const contents = {};

  try {
    const items = await fetchRepoContents(owner, repo, path);

    for (const item of items) {
      const nodeId = uniqueId();

      if (item.type === "file") {
        const binary = isBinaryFile(item.name);
        nodes.push({
          id: nodeId,
          name: item.name,
          type: "file",
          children: [],
          path: item.path,
          download_url: item.download_url,
          isBinary: binary,
        });

        // Fetch file content
        try {
          const content = await fetchFileContent(item.download_url, binary);
          contents[nodeId] = content;
        } catch (err) {
          console.warn(`Failed to fetch content for ${item.name}:`, err);
          contents[nodeId] = binary ? "" : `// Error loading ${item.name}\n`;
        }
      } else if (item.type === "dir") {
        // Recursively fetch directory contents
        const { nodes: childNodes, contents: childContents } = await buildRepoTreeRecursive(owner, repo, item.path, uniqueId);

        nodes.push({
          id: nodeId,
          name: item.name,
          type: "folder",
          children: childNodes,
        });

        // Merge child contents
        Object.assign(contents, childContents);
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch contents for path ${path}:`, err);
  }

  return { nodes, contents };
};

/**
 * Main function to clone a GitHub repository
 * @param {string} githubUrl - GitHub repository URL
 * @param {Function} uniqueId - ID generator function
 * @returns {Promise<{tree: Array, contents: Object, repoName: string}>}
 */
export const cloneRepository = async (githubUrl, uniqueId) => {
  const parsed = parseGithubUrl(githubUrl);
  if (!parsed) {
    throw new Error("Invalid GitHub URL. Please use format: https://github.com/owner/repo");
  }

  const { owner, repo } = parsed;

  // Fetch repository info
  const repoInfoResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  if (!repoInfoResponse.ok) {
    throw new Error(`Failed to fetch repository info: ${repoInfoResponse.statusText}`);
  }

  const repoInfo = await repoInfoResponse.json();

  // Build tree structure
  const { nodes, contents } = await buildRepoTreeRecursive(owner, repo, "", uniqueId);

  // Create root node
  const rootId = uniqueId();
  const tree = [
    {
      id: rootId,
      name: repoInfo.name || repo,
      type: "folder",
      children: nodes,
    },
  ];

  return {
    tree,
    contents,
    repoName: repoInfo.name || repo,
  };
};
