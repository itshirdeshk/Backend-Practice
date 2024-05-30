import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleFormSubmit = (ev) => {
        ev.preventDefault();
        navigate(`/room/${roomCode}`);
    }

    return (
        <div className="home-page">
            <form onSubmit={handleFormSubmit} className="form">
                <div>
                    <label>Enter Rooom Code</label>
                    <input type="text" required value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
                </div>
                <button>Enter Room</button>
            </form>
        </div>
    )
}

export default HomePage