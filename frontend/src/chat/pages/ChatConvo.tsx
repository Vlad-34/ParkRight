import { getMessages, selectMessages, sendMessage } from "../redux";
import styled from "styled-components";
import { Message, User } from "../../types/userTypes";
import Input from "../../components/input";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Button from "../../components/button";
import { useSelector } from "react-redux";
import { selectUserId } from "../../auth";

/**
 * ConvoCell is a styled component that renders the conversation cell.
 * It uses the styled-components library.
 * It takes a boolean prop foreignSender.
 * The component is a div that displays the conversation cell.
 */
const ConvoCell = styled.div`
  display: flex;
  flex-direction: row;
  &: hover {
    background-color: #f0f0f0;
  }
`;

/**
 * ChatConvo is a React functional component that renders the ChatConvo page.
 * @param user User object containing user information
 * @param websocket WebSocket object
 * @returns ChatConvo component
 */
const ChatConvo = ({
  user,
  websocket,
}: {
  user: User;
  websocket: WebSocket | null;
}) => {
  console.log("user", user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getMessages());
  }, [dispatch]);
  const messagesData = useAppSelector(selectMessages);
  console.log("messagesData", messagesData);
  const messages = Array.isArray(messagesData)
    ? messagesData.filter((message: Message) => {
        return message.sender === user.id || message.receiver === user.id;
      })
    : [];
  console.log("messages", messages);
  const [message, setMessage] = useState<number | string>("");
  const userId = useSelector(selectUserId);

  return (
    <div
      style={{
        width: "70%",
        marginLeft: "5%",
        marginRight: "3%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          backgroundColor: "#98ff98",
          width: "100%",
          height: "5vh",
          padding: "1%",
          display: "flex",
          alignItems: "center",
        }}
      >
        {user.username}
      </div>
      <div
        style={{
          width: "102%",
          marginTop: "1vh",
        }}
      >
        {messages.map((message, index) => (
          <ConvoCell key={index}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "1%",
                marginTop: "1vh",
                backgroundColor: "transparent",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <b>{message.sender === user.id ? user.username : "You"}</b>
                &nbsp; &nbsp;
                <i style={{ fontSize: "10px" }}>
                  {new Date(message.timestamp).toLocaleString()}
                </i>
              </div>
              {message.content}
            </div>
          </ConvoCell>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "70%",
          justifyContent: "space-between",
          position: "fixed",
          bottom: "0",
        }}
      >
        <div
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Input
            value={message}
            labelName={"Message"}
            fieldName={""}
            setValue={setMessage}
          />
        </div>
        <div
          style={{
            width: "20%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            content="Send Message"
            action={() => {
              dispatch(
                sendMessage({
                  websocket: websocket,
                  message: {
                    sender: userId ?? 0,
                    receiver: user.id,
                    content: message.toString(),
                    timestamp: new Date().toISOString(),
                  },
                }),
              );
              setMessage("");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatConvo;
