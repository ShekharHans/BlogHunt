import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMicrophone,
    faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

function FullBlogPost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [speaking, setSpeaking] = useState(false);
    const [speech, setSpeech] = useState(null);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

    useEffect(() => {
        fetch("/src/json/blogPost.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch blog posts");
                }
                return response.json();
            })
            .then((data) => {
                const selectedPost = data.posts.find(
                    (post) => post.id === parseInt(id),
                );
                if (!selectedPost) {
                    throw new Error(`Blog post with id ${id} not found`);
                }
                setPost(selectedPost);
            })
            .catch((error) => {
                console.error("Error fetching blog posts:", error);
            });
    }, [id]);

    useEffect(() => {
        const getVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(
                availableVoices.filter(
                    (voice) =>
                        voice.lang.startsWith("en") &&
                        (voice.name.includes("Male") ||
                            voice.name.includes("Female")),
                ),
            );
            setSelectedVoice(
                availableVoices.find(
                    (voice) =>
                        voice.default &&
                        voice.lang.startsWith("en") &&
                        (voice.name.includes("Male") ||
                            voice.name.includes("Female")),
                ),
            );
        };

        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            getVoices();
            window.speechSynthesis.onvoiceschanged = getVoices;
        }
    }, []);

    const speak = () => {
        const text = post.content;
        const speechSynthesis = window.speechSynthesis;

        if (!text) {
            console.error("No content to read.");
            return;
        }

        if (!speechSynthesis) {
            console.error("Speech synthesis not supported.");
            return;
        }

        if (!speaking) {
            // Split content into smaller chunks if it's too long
            const chunkSize = 200; // Adjust this value as needed
            const chunks = text.match(new RegExp(`.{1,${chunkSize}}`, "g"));

            if (!chunks || chunks.length === 0) {
                console.error("Content cannot be split into chunks.");
                return;
            }

            const utterances = chunks.map((chunk) => {
                const utterance = new SpeechSynthesisUtterance(chunk);
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
                utterance.onend = () => {
                    setSpeaking(false);
                };
                return utterance;
            });

            // Start speaking each chunk sequentially
            utterances.reduce((prevPromise, utterance) => {
                return prevPromise.then(() => {
                    return new Promise((resolve) => {
                        setSpeech(utterance);
                        setSpeaking(true);
                        speechSynthesis.speak(utterance);
                        utterance.onend = resolve;
                    });
                });
            }, Promise.resolve());
        } else {
            // Stop speaking
            speechSynthesis.cancel();
            setSpeaking(false);
        }
    };
    return (
        <div className="FullBlogPostContainer min-h-screen py-8 pt-24">
            <div className="container mx-auto px-4 lg:px-8">
                {post && (
                    <div>
                        <div className="post-details mb-8">
                            <div className="flex justify-between">
                                <h2 className="text-3xl font-bold text-slate-200 mb-2">
                                    {post.title}
                                </h2>
                                <button
                                    className={`bg-transparent text-slate-500 hover:text-blue-500 ${
                                        !post.content || !window.speechSynthesis
                                            ? "pointer-events-none"
                                            : ""
                                    }`}
                                    onClick={speak}
                                    disabled={
                                        !post.content || !window.speechSynthesis
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            speaking
                                                ? faMicrophoneSlash
                                                : faMicrophone
                                        }
                                        className="text-3xl"
                                    />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600">
                                Author: {post.author}
                            </p>
                            <p className="text-sm text-gray-600">
                                Date: {post.date}
                            </p>
                        </div>
                        <p className="content text-lg text-slate-500">
                            {post.content}
                        </p>
                    </div>
                )}
                <Link to={"/"}>
                    <button className="text-slate-500 hover:text-blue-500 rounded-full flex text-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 hover:dark:border-slate-700 hover:bg-slate-50 hover:dark:bg-slate-800 focus:ring focus:ring-offset-1 focus:ring-offset-white focus:ring-blue-600 dark:focus:ring-offset-slate-800 disabled:bg-white disabled:border-slate-200 disabled:cursor-not-allowed disabled:text-slate-300 disabled:dark:bg-slate-950 disabled:dark:border-slate-800 disabled:dark:text-slate-800 text-sm py-2.5 px-5 items-center justify-center mt-10">
                        Go Back
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default FullBlogPost;
