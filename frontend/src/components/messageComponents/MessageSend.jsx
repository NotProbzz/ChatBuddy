import React, { useEffect, useRef, useState } from "react";
import { FaFolderOpen, FaPaperPlane } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setSendLoading, setTyping } from "../../redux/slices/conditionSlice";
import {
	addNewMessage,
	addNewMessageId,
} from "../../redux/slices/messageSlice";
import { LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

let lastTypingTime;
const MessageSend = ({ chatId }) => {
	const mediaFile = useRef();
	// const [mediaBox, setMediaBox] = useState(false);
	// const [mediaURL, setMediaURL] = useState("");
	const [newMessage, setMessage] = useState("");
	const dispatch = useDispatch();
	const isSendLoading = useSelector(
		(store) => store?.condition?.isSendLoading
	);
	const isSocketConnected = useSelector(
		(store) => store?.condition?.isSocketConnected
	);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const isTyping = useSelector((store) => store?.condition?.isTyping);

	useEffect(() => {
		socket.on("typing", () => dispatch(setTyping(true)));
		socket.on("stop typing", () => dispatch(setTyping(false)));
	}, []);

	// Media Box Control
	const handleMediaBox = () => {
		if (mediaFile.current?.files[0]) {
			// const file = mediaFile.current.files[0];
			// const url = URL.createObjectURL(file);
			// setMediaURL(url);
			// setMediaBox(true);
			toast.warn("Comming soon...");
		} else {
			// setMediaBox(false);
		}
	};

	// Media Box Hidden && Input file remove
	// const clearMediaFile = () => {
	//     mediaFile.current.value = "";
	//     setMediaURL("");
	//     setMediaBox(false);
	// };

	// Send Message Api call
	const handleSendMessage = async () => {
		if (newMessage?.trim()) {
			const message = newMessage?.trim();
			setMessage("");
			socket.emit("stop typing", selectedChat._id);
			dispatch(setSendLoading(true));
			const token = localStorage.getItem("token");
			fetch(`/api/message`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					message: message,
					chatId: chatId,
				}),
			})
				.then((res) => res.json())
				.then((json) => {
					dispatch(addNewMessageId(json?.data?._id));
					dispatch(addNewMessage(json?.data));
					socket.emit("new message", json.data);
					dispatch(setSendLoading(false));
				})
				.catch((err) => {
					console.log(err);
					dispatch(setSendLoading(false));
					toast.error("Message Sending Failed");
				});
		}
	};

	const handleTyping = (e) => {
		setMessage(e.target?.value);
		if (!isSocketConnected) return;
		if (!isTyping) {
			socket.emit("typing", selectedChat._id);
		}
		lastTypingTime = new Date().getTime();
		let timerLength = 3000;
		let stopTyping = setTimeout(() => {
			let timeNow = new Date().getTime();
			let timeDiff = timeNow - lastTypingTime;
			if (timeDiff > timerLength) {
				socket.emit("stop typing", selectedChat._id);
			}
		}, timerLength);
		return () => clearTimeout(stopTyping);
	};

	return (
		<>
			<form
				className="flex h-[88px] w-full items-center gap-2 border-t border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] p-3 text-[#172033] dark:text-[#dbdee1]"
				onSubmit={(e) => e.preventDefault()}
			>
				<label
					htmlFor="media"
					className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#F8FAFF] dark:bg-[#2b2d31] text-[#2563EB] transition-colors hover:bg-[#EFF6FF]"
				>
					<FaFolderOpen
						title="Open File"
						size={18}
						className="active:scale-75"
					/>
				</label>
				<input
					ref={mediaFile}
					type="file"
					name="image"
					accept="image/png, image/jpg, image/gif, image/jpeg"
					id="media"
					className="hidden"
					onChange={handleMediaBox}
				/>
				<input
					type="text"
					className="w-full rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] px-4 py-3 text-sm text-[#172033] dark:text-[#dbdee1] outline-none placeholder:text-[#94A3B8] focus:border-[#BFDBFE] focus:bg-white dark:bg-[#313338]"
					placeholder="Type a message"
					value={newMessage}
					onChange={(e) => handleTyping(e)}
				/>
				<span className="flex items-center justify-center">
					{newMessage?.trim() && !isSendLoading && (
						<button
							className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-[0_12px_24px_rgba(37,99,235,0.25)] transition-all hover:bg-[#1D4ED8]"
							onClick={handleSendMessage}
						>
							<FaPaperPlane
								title="Send"
								size={16}
								className="active:scale-75"
							/>
						</button>
					)}
					{isSendLoading && (
						<button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-[0_12px_24px_rgba(37,99,235,0.25)]">
							<LuLoader
								title="loading..."
								fontSize={16}
								className="animate-spin"
							/>
						</button>
					)}
				</span>
			</form>
		</>
	);
};

export default MessageSend;
