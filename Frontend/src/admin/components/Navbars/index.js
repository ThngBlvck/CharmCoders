import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

export default function Navbar() {
    const navigate = useNavigate(); // Initialize navigate for navigation

    // Handle the chat button click
    const goToChat = () => {
        navigate("/admin/chat"); // Redirect to admin chat page
    };

    return (
        <>
            {/* Navbar */}
            <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
                <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
                    {/* Brand */}
                    <a
                        className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                    >
                        GlowMakers
                    </a>
                    {/* Chat Button */}
                    <button
                        onClick={goToChat}
                        className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        <i className="fa fa-headset" style={{marginRight: "6px"}}></i>Chăm sóc khách hàng
                    </button>
                    {/* User */}
                    <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
                    </ul>
                </div>
            </nav>
            {/* End Navbar */}
        </>
    );
}
