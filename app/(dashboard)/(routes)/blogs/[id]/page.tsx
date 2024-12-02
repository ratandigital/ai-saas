"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogDetail = () => {
  const { id } = useParams(); // Get the ID from URL params
  const [blog, setBlog] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/post/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch blog: ${response.statusText}`);
        }

        const data = await response.json();
        setBlog(data);
      } catch (error: any) {
        setError(error.message || 'An unknown error occurred');
      }
    };

    fetchBlogDetail();
  }, [id]);

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">{blog.promtMassage}</h1>
        <div className="text-lg text-gray-700 mt-4 whitespace-pre-wrap leading-relaxed">
  <ReactMarkdown
    className="markdown-content"
    remarkPlugins={[remarkGfm]}
  >
    {blog.ansMassage.replace(/\\n/g, '\n\n')}
  </ReactMarkdown>
</div>


        <p className="mt-6 text-sm text-gray-500 italic">
          Published on: {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default BlogDetail;
