// Blog.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/blog.css";

function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        fetch("/blogPost.json")
            .then((response) => response.json())
            .then((data) => setPosts(data.posts))
            .catch((error) =>
                console.error("Error fetching blog posts:", error),
            );
    }, []);

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };


    return (
        <div className="blog-container pt-24">
            <div className="search-container">
                <input
                    className="search-input rounded-full"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button
                    className="clear-button rounded-full flex text-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 hover:dark:border-slate-700 hover:bg-slate-50 hover:dark:bg-slate-800 focus:ring focus:ring-offset-1 focus:ring-offset-white focus:ring-blue-600 dark:focus:ring-offset-slate-800 disabled:bg-white disabled:border-slate-200 disabled:cursor-not-allowed disabled:text-slate-300 disabled:dark:bg-slate-950 disabled:dark:border-slate-800 disabled:dark:text-slate-800 text-sm py-2.5 px-5 items-center justify-center"
                    onClick={handleClearSearch}
                >
                    Clear
                </button>
            </div>
            <ul className="post-list">
                {filteredPosts.map((post) => (
                    <li
                        className="post-item w-full first-of-type:border-t-0 lg:!border border-t border-slate-200 dark:border-slate-800/80 rounded-none lg:rounded-2xl pt-5 bg-white dark:bg-slate-950 flex flex-col gap-2 md:gap-5 md:pt-8 lg:p-6 lg:pb-5"
                        key={post.id}
                    >
                        <p className="font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                            {" "}
                            {post.author}
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
                            {post.date}
                        </p>
                        <Link to={`/blog/${post.id}`}>
                            <h2 className="post-title font-heading text-base sm:text-xl font-semibold sm:font-bold  text-slate-700 dark:text-slate-200 hn-break-words cursor-pointer">
                                {post.title}
                            </h2>
                        </Link>

                        <div className=" flex gap-1 ">
                            <p className="text-base hidden font-normal text-slate-500 dark:text-slate-400 hn-break-words md:line-clamp-2">
                                {post.content.split(" ").slice(0, 10).join(" ")}
                                ...
                            </p>
                            <Link to={`/blog/${post.id}`}>
                                <button className=" text-slate-500 hover:text-blue-500">
                                    Read More
                                </button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BlogPage;
