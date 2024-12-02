// components/BlogList.tsx
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Blog {
  id: string;
  promtMassage: string;
  ansMassage: string;
}

interface BlogListProps {
  newBlog?: Blog; // Accept new blog as a prop
}

const BlogList = ({ newBlog }: BlogListProps) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`/api/blogs?page=${currentPage}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.statusText}`);
        }

        const data = await response.json();
        setBlogs(data.posts);
        setTotalPosts(data.totalPosts);
      } catch (error: any) {
        setError(error.message || 'An unknown error occurred');
      }
    };

    fetchBlogs();
  }, [currentPage]);

  // Update the blogs state when a new blog is received
  useEffect(() => {
    if (newBlog) {
      setBlogs((current) => [newBlog, ...current]); // Prepend the new blog to the current list
    }
  }, [newBlog]);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleReadMore = (id: string) => {
    window.location.href = `/blogs/${id}`;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Latest Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <div className="p-4">
              <h2 className="font-semibold text-xl">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {
                    // Slicing promtMassage for display with markdown support
                    typeof blog.promtMassage === 'string'
                      ? blog.promtMassage.slice(0, 50) + '...'
                      : 'Content not available'
                  }
                </ReactMarkdown>
              </h2>
              <div className="mt-2 text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {
                    // Ensure the markdown is fully processed by replacing \n with double newlines.
                    typeof blog.ansMassage === 'string'
                      ? blog.ansMassage.replace(/\\n/g, '\n\n').slice(0, 150) + '...'
                      : 'Content not available'
                  }
                </ReactMarkdown>
              </div>
              <button
                onClick={() => handleReadMore(blog.id)}
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-black'
            } transition duration-200 hover:bg-blue-100`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
