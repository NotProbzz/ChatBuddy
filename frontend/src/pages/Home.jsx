import React, { useEffect } from "react";
import { MdChat } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import UserSearch from "../components/chatComponents/UserSearch";
import MyChat from "../components/chatComponents/MyChat";
import MessageBox from "../components/messageComponents/MessageBox";
import ChatNotSelected from "../components/chatComponents/ChatNotSelected";
import {
	setChatDetailsBox,
	setSocketConnected,
	setUserSearchBox,
} from "../redux/slices/conditionSlice";
import socket from "../socket/socket";
import { addAllMessages, addNewMessage } from "../redux/slices/messageSlice";
import {
	addNewChat,
	addNewMessageRecieved,
	deleteSelectedChat,
} from "../redux/slices/myChatSlice";
import { toast } from "react-toastify";
import { receivedSound } from "../utils/notificationSound";
let selectedChatCompare;

const Home = () => {
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const dispatch = useDispatch();
	const isUserSearchBox = useSelector(
		(store) => store?.condition?.isUserSearchBox
	);
	const authUserId = useSelector((store) => store?.auth?._id);

	// socket connection
	useEffect(() => {
		if (!authUserId) return;
		socket.emit("setup", authUserId);
		socket.on("connected", () => dispatch(setSocketConnected(true)));
	}, [authUserId]);

	// socket message received
	useEffect(() => {
		selectedChatCompare = selectedChat;
		const messageHandler = (newMessageReceived) => {
			if (
				selectedChatCompare &&
				selectedChatCompare._id === newMessageReceived.chat._id
			) {
				dispatch(addNewMessage(newMessageReceived));
			} else {
				receivedSound();
				dispatch(addNewMessageRecieved(newMessageReceived));
			}
		};
		socket.on("message received", messageHandler);

		return () => {
			socket.off("message received", messageHandler);
		};
	});

	// socket clear chat messages
	useEffect(() => {
		const clearChatHandler = (chatId) => {
			if (chatId === selectedChat?._id) {
				dispatch(addAllMessages([]));
				toast.success("Cleared all messages");
			}
		};
		socket.on("clear chat", clearChatHandler);
		return () => {
			socket.off("clear chat", clearChatHandler);
		};
	});
	// socket delete chat messages
	useEffect(() => {
		const deleteChatHandler = (chatId) => {
			dispatch(setChatDetailsBox(false));
			if (selectedChat && chatId === selectedChat._id) {
				dispatch(addAllMessages([]));
			}
			dispatch(deleteSelectedChat(chatId));
			toast.success("Chat deleted successfully");
		};
		socket.on("delete chat", deleteChatHandler);
		return () => {
			socket.off("delete chat", deleteChatHandler);
		};
	});

	// socket chat created
	useEffect(() => {
		const chatCreatedHandler = (chat) => {
			dispatch(addNewChat(chat));
			toast.success("Created & Selected chat");
		};
		socket.on("chat created", chatCreatedHandler);
		return () => {
			socket.off("chat created", chatCreatedHandler);
		};
	});

	return (
		<div className="relative flex w-full overflow-hidden rounded-[28px] border border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] shadow-[0_20px_50px_rgba(15,23,42,0.04)]">
			<div
				className={`${
					selectedChat && "hidden"
				} sm:block sm:w-[38%] w-full h-[80vh] border-r border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] relative`}
			>
				<div className="absolute bottom-4 right-5 cursor-pointer rounded-full bg-[#2563EB] p-3 text-white shadow-[0_10px_24px_rgba(37,99,235,0.25)] transition-transform hover:scale-105">
					<MdChat
						title="New Chat"
						fontSize={24}
						onClick={() => dispatch(setUserSearchBox())}
					/>
				</div>
				{isUserSearchBox ? <UserSearch /> : <MyChat />}
			</div>
			<div
				className={`${
					!selectedChat && "hidden"
				} sm:block sm:w-[62%] w-full h-[80vh] bg-[#F8FAFF] dark:bg-[#2b2d31] relative overflow-hidden`}
			>
				{selectedChat ? (
					<MessageBox chatId={selectedChat?._id} />
				) : (
					<ChatNotSelected />
				)}
			</div>
		</div>
	);
};

export default Home;
