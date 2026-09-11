import React, { useEffect, useRef, useState } from "react";
import DefaultAvatar from "../../assets/boy.png";
import { FaArrowLeft } from "react-icons/fa";
import {
	setChatDetailsBox,
	setMessageLoading,
} from "../../redux/slices/conditionSlice";
import { useDispatch, useSelector } from "react-redux";
import AllMessages from "./AllMessages";
import MessageSend from "./MessageSend";
import { addAllMessages } from "../../redux/slices/messageSlice";
import MessageLoading from "../loading/MessageLoading";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import getChatName, { getChatImage } from "../../utils/getChatName";
import ChatDetailsBox from "../chatDetails/ChatDetailsBox";
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

const MessageBox = ({ chatId }) => {
	const dispatch = useDispatch();
	const chatDetailsBox = useRef(null);
	const [isExiting, setIsExiting] = useState(false);
	const isChatDetailsBox = useSelector(
		(store) => store?.condition?.isChatDetailsBox
	);
	const isMessageLoading = useSelector(
		(store) => store?.condition?.isMessageLoading
	);
	const allMessage = useSelector((store) => store?.message?.message);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const authUserId = useSelector((store) => store?.auth?._id);

	useEffect(() => {
		const getMessage = (chatId) => {
			dispatch(setMessageLoading(true));
			const token = localStorage.getItem("token");
			fetch(`/api/message/${chatId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((json) => {
					dispatch(addAllMessages(json?.data || []));
					dispatch(setMessageLoading(false));
					socket.emit("join chat", selectedChat._id);
				})
				.catch((err) => {
					console.log(err);
					dispatch(setMessageLoading(false));
					toast.error("Message Loading Failed");
				});
		};
		getMessage(chatId);
	}, [chatId]);

	// chatDetailsBox outside click handler
	const handleClickOutside = (event) => {
		if (
			chatDetailsBox.current &&
			!chatDetailsBox.current.contains(event.target)
		) {
			setIsExiting(true);
			setTimeout(() => {
				dispatch(setChatDetailsBox(false));
				setIsExiting(false);
			}, 500);
		}
	};

	// add && remove events according to isChatDetailsBox
	useEffect(() => {
		if (isChatDetailsBox) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isChatDetailsBox]);
	return (
		<>
			<div
				className="flex h-[88px] w-full items-center justify-between border-b border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] px-4 py-3 sm:px-5 text-[#172033] dark:text-[#dbdee1] cursor-pointer"
				onClick={() => dispatch(setChatDetailsBox(true))}
			>
				<div className="flex items-center gap-3">
					<div
						onClick={(e) => {
							e.stopPropagation();
							dispatch(addSelectedChat(null));
						}}
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] transition-colors hover:bg-[#DBEAFE] sm:hidden"
					>
						<FaArrowLeft title="Back" fontSize={14} />
					</div>
					<img
  src={getChatImage(selectedChat, authUserId)}
  alt="Profile"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = DefaultAvatar;
  }}
  className="h-9 w-9 rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] object-cover"
/>
					<h1 className="line-clamp-1 text-base font-semibold text-[#172033] dark:text-[#dbdee1]">
						{getChatName(selectedChat, authUserId)}
					</h1>
				</div>
				<CiMenuKebab
					fontSize={18}
					title="Menu"
					className="cursor-pointer text-[#475569] dark:text-[#b5bac1]"
				/>
			</div>
			{isChatDetailsBox && (
				<div
					className={`absolute left-0 top-0 z-20 h-[60vh] w-full max-w-96 p-1 ${
						isExiting ? "box-exit" : "box-enter"
					}`}
				>
					<div
						ref={chatDetailsBox}
						className="flex overflow-hidden rounded-2xl border border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
					>
						<ChatDetailsBox />
					</div>
				</div>
			)}
			{isMessageLoading ? (
				<MessageLoading />
			) : (
				<AllMessages allMessage={allMessage} />
			)}
			<MessageSend chatId={chatId} />
		</>
	);
};

export default MessageBox;
