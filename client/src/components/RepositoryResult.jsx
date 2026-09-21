import React, { useState } from "react";
import { api } from "../api/apiInstance";

export const RepositoryResult = ({ repository }) => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState("content_copy");

  const handleCopy = async () => {
    const text = `${post.hook}

${post.content}

${post.hashtags.join(" ")}

${post.cta}`;

    await navigator.clipboard.writeText(text);
    setIcon("check_small");
  };

  const handleGenerate = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/posts/generate",
        {
          repositoryId: repository._id,
        },
        {
          timeout: 60000,
        },
      );

      setPost(response.data.post);
    } catch (error) {
      console.error("GENERATE ERROR:", error);
      setError(error.response?.data?.message || "AI post generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-800 bg-gray-950 p-6 text-white shadow-2xl">
      {/* Repository Header */}
      <div className="mb-8 border-b border-gray-800 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-400">
              GitHub Repository
            </p>

            <h2 className="text-2xl font-bold tracking-tight">
              {repository.name}
            </h2>

            <p className="mt-2 max-w-2xl text-gray-400">
              {repository.description || "No description available."}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Owner: <span className="text-gray-300">{repository.owner}</span>
            </p>
          </div>

          <a
            href={repository.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-indigo-500 hover:bg-gray-900 hover:text-white"
          >
            View on GitHub ↗
          </a>
        </div>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-lg bg-gray-900 px-4 py-3">
            <p className="text-xs text-gray-500">Stars</p>
            <p className="mt-1 font-semibold">⭐ {repository.stars}</p>
          </div>

          <div className="rounded-lg bg-gray-900 px-4 py-3">
            <p className="text-xs text-gray-500">Languages</p>
            <p className="mt-1 font-semibold">
              {Object.keys(repository.languages || {}).length}
            </p>
          </div>

          <div className="rounded-lg bg-gray-900 px-4 py-3">
            <p className="text-xs text-gray-500">Topics</p>
            <p className="mt-1 font-semibold">
              {repository.topics.length || []}
            </p>
          </div>

          <div className="rounded-lg bg-gray-900 px-4 py-3">
            <p className="text-xs text-gray-500">Files</p>
            <p className="mt-1 font-semibold">
              {(repository.files || []).length}
            </p>
          </div>
        </div>
      </div>

      {/* Repository Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Languages */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <h3 className="mb-4 text-lg font-semibold">Languages</h3>

          <div className="flex flex-wrap gap-2">
            {Object.entries(repository.languages || {}).map(
              ([language, bytes]) => (
                <span
                  key={language}
                  className="rounded-full bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-300"
                >
                  {language}
                  <span className="ml-2 text-gray-500">{bytes}</span>
                </span>
              ),
            )}
          </div>
        </div>

        {/* Topics */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <h3 className="mb-4 text-lg font-semibold">Topics</h3>

          {(repository.topics || []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(repository.topics || []).map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-300"
                >
                  #{topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No topics available</p>
          )}
        </div>
      </div>

      {/* Files */}
      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/60 p-5">
        <h3 className="mb-4 text-lg font-semibold">Repository Files</h3>

        {(repository.files || []).length > 0 ? (
          <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
            {(repository.files || []).map((file) => (
              <span
                key={file}
                className="rounded-md bg-gray-800 px-3 py-1.5 font-mono text-xs text-gray-400"
              >
                {file}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No files available</p>
        )}
      </div>

      {/* README */}
      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/60 p-5">
        <h3 className="mb-4 text-lg font-semibold">README</h3>

        <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-950 p-4 font-mono text-sm leading-6 text-gray-400">
          {repository.readme || "No README available."}
        </pre>
      </div>

      {/* Generate Section */}
      <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Generate your LinkedIn post
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Let AI turn this repository into a professional LinkedIn post.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Post ✨"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Generated Post */}
      {post && (
        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
          <div className="mb-6">
            <p className="text-sm font-medium text-indigo-400">
              AI Generated Content
            </p>

            <h2 className="mt-1 text-2xl font-bold">Your LinkedIn Post</h2>

            <p className="mt-1 text-sm text-gray-500">
              Edit the generated content before posting.
            </p>
          </div>

          {/* Hook */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Hook
            </label>

            <textarea
              value={post.hook}
              onChange={(e) =>
                setPost({
                  ...post,
                  hook: e.target.value,
                })
              }
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 p-4 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Content */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Content
            </label>

            <textarea
              value={post.content}
              onChange={(e) =>
                setPost({
                  ...post,
                  content: e.target.value,
                })
              }
              rows={10}
              className="w-full resize-y rounded-xl border border-gray-700 bg-gray-950 p-4 text-gray-200 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Hashtags */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Hashtags
            </label>

            <textarea
              value={post.hashtags.join(" ")}
              onChange={(e) =>
                setPost({
                  ...post,
                  hashtags: e.target.value.split(/\s+/),
                })
              }
              rows={2}
              className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 p-4 text-gray-200 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* CTA */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Call to Action
            </label>

            <textarea
              value={post.cta}
              onChange={(e) =>
                setPost({
                  ...post,
                  cta: e.target.value,
                })
              }
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 p-4 text-gray-200 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div onClick={handleCopy} className="cursor-pointer">
            <span className="material-symbols-outlined">{icon}</span>
          </div>

          {/* Preview */}
          <div className="border-t border-gray-800 pt-6">
            <p className="mb-3 text-sm font-semibold text-gray-400">Preview</p>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
              <p className="whitespace-pre-wrap font-semibold text-gray-100">
                {post.hook}
              </p>

              <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-300">
                {post.content}
              </p>

              <p className="mt-4 text-indigo-400">{post.hashtags.join(" ")}</p>

              <p className="mt-4 text-gray-300">{post.cta}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
