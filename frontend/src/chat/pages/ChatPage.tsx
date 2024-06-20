// ChatPage.js
import { useEffect, useRef, useState } from "react";
import ChatConvo from "./ChatConvo";
import { getUsers, selectUsers, setMessages } from "..";
import { useAppDispatch } from "../../store/hooks";
import { useSelector } from "react-redux";
import { selectUserId } from "../../auth";

/**
 * ChatPage is a React functional component that renders the ChatPage page.
 * It uses the useAppDispatch hook.
 * It also uses the getUsers function.
 * It renders a page that allows the user to chat with other users.
 * The user can select a user to chat with from a list of users.
 * The user can send messages to the selected user.
 * @returns ChatPage component
 */
const ChatPage = () => {
  const dispatch = useAppDispatch();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const users = useSelector(selectUsers);
  const userId = useSelector(selectUserId);
  const websocketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${userId}/`);

    ws.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      dispatch(setMessages(data));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    websocketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: "3vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "25%",
        }}
      >
        {users
          ? users.map((user) => (
              <button
                style={{
                  backgroundColor: "#50c878",
                  border: "none",
                  marginBottom: "1vh",
                  padding: "1vh",
                  display: "flex",
                  alignItems: "left",
                }}
                onClick={() => {
                  setSelectedUser(user.id);
                }}
                key={user.id}
              >
                {user.username}
              </button>
            ))
          : null}
      </div>
      {selectedUser && (
        <ChatConvo
          websocket={websocketRef.current}
          user={
            users.filter((user) => {
              return user.id === selectedUser;
            })[0]
          }
        />
      )}
    </div>
  );
};

export default ChatPage;
