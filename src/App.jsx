// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import FullBlogPost from "./pages/FullBlogPost";
import ErrorPage from "./pages/ErrorPage";
import NavbarPage from "./pages/Navbar";
import BlogPage from "./pages/BlogPage";

function App() {
    return (
        <>
            <NavbarPage />
            <Router>
                <Routes>
                    <Route exact path="/" element={<BlogPage />} />
                    <Route path="/blog/:id" element={<FullBlogPost />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </Router>
            <div>
                <footer className="bg-gray-800 text-white py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between">
                            <div className="flex space-x-4">
                                <a
                                    href="/"
                                    className="hover:text-gray-300 transition duration-300"
                                >
                                    Home
                                </a>
                                <a
                                    href="/"
                                    className="hover:text-gray-300 transition duration-300"
                                >
                                    About
                                </a>
                                <a
                                    href="/"
                                    className="hover:text-gray-300 transition duration-300"
                                >
                                    Contact
                                </a>
                            </div>
                            <div>
                                <p>
                                    &copy; {new Date().getFullYear()} BlogHunt
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default App;
