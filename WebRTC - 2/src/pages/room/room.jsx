import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt"

const RoomPage = () => {
    const { roomId } = useParams();
    const myMeeting = async (element) => {
        const appId = 1335299174;
        const serverSecret = "db1e21540bc0e07225b7329813373f63";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serverSecret, roomId, Date.now().toString(), 'Hirdesh');
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference
            }
        })
    }

    return (
        <div className="room-page">
            <div ref={myMeeting} />
        </div>
    )
}

export default RoomPage