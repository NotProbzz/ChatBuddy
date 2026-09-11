import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	setChatLoading,
	setGroupChatBox,
	setGroupChatId,
	setLoading,
} from "../../redux/slices/conditionSlice";
import { MdOutlineClose } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import ChatShimmer from "../loading/ChatShimmer";
import { handleScrollEnd } from "../../utils/handleScrollTop";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import socket from "../../socket/socket";

const GroupChatBox = () => {
	const groupUser = useRef("");
	const dispatch = useDispatch();
	const isChatLoading = useSelector(
		(store) => store?.condition?.isChatLoading
	);
	const authUserId = useSelector((store) => store?.auth?._id);
	const [isGroupName, setGroupName] = useState("");
	const [users, setUsers] = useState([]);
	const [inputUserName, setInputUserName] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [isGroupUsers, setGroupUsers] = useState([]);

	useEffect(() => {
		const getAllUsers = () => {
			dispatch(setChatLoading(true));
			const token = localStorage.getItem("token");
			fetch(`/api/user/users`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((json) => {
					setUsers(json.data || []);
					setSelectedUsers(json.data || []);
					dispatch(setChatLoading(false));
				})
				.catch((err) => {
					console.log(err);
					dispatch(setChatLoading(false));
				});
		};
		getAllUsers();
	}, []);

	useEffect(() => {
		setSelectedUsers(
			users.filter((user) => {
				return (
					user.firstName
						.toLowerCase()
						.includes(inputUserName?.toLowerCase()) ||
					user.lastName
						.toLowerCase()
						.includes(inputUserName?.toLowerCase()) ||
					user.email
						.toLowerCase()
						.includes(inputUserName?.toLowerCase())
				);
			})
		);
	}, [inputUserName]);

	useEffect(() => {
		handleScrollEnd(groupUser.current);
	}, [isGroupUsers]);

	const addGroupUser = (user) => {
		const existUsers = isGroupUsers.find(
			(currUser) => currUser?._id == user?._id
		);
		if (!existUsers) {
			setGroupUsers([...isGroupUsers, user]);
		} else {
			toast.warn('"' + user?.firstName + '" already Added');
		}
	};

	const handleRemoveGroupUser = (removeUserId) => {
		setGroupUsers(
			isGroupUsers.filter((user) => {
				return user?._id !== removeUserId;
			})
		);
	};

	const handleCreateGroupChat = async () => {
		if (isGroupUsers.length < 2) {
			toast.warn("Please select atleast 2 users");
			return;
		} else if (!isGroupName.trim()) {
			toast.warn("Please enter group name");
			return;
		}
		dispatch(setGroupChatBox());
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`/api/chat/group`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: isGroupName.trim(),
				users: isGroupUsers,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addSelectedChat(json?.data));
				dispatch(setGroupChatId(json?.data?._id));
				dispatch(setLoading(false));
				socket.emit("chat created", json?.data, authUserId);
				toast.success("Created & Selected chat");
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
				dispatch(setLoading(false));
			});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/20 p-4 backdrop-blur-[2px]">
			<div className="relative mt-5 h-fit w-[80%] min-w-72 max-w-[1000px] rounded-[28px] border border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] p-3 pt-4 shadow-[0_28px_60px_rgba(15,23,42,0.14)] sm:w-[60%] md:w-[50%] lg:w-[40%]">
				<h2 className="mb-2 w-full text-center text-2xl font-semibold text-[#172033] dark:text-[#dbdee1]">
					Create a Group
				</h2>
				<div className="flex w-full flex-wrap items-center justify-evenly gap-3 py-4">
					<div className="flex w-full flex-nowrap items-center justify-center gap-2">
						<input
							value={inputUserName}
							id="search"
							type="text"
							placeholder="Search Users..."
							className="w-2/3 rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] px-3 py-2 text-sm text-[#172033] dark:text-[#dbdee1] outline-none placeholder:text-[#94A3B8] focus:border-[#BFDBFE]"
							onChange={(e) => setInputUserName(e.target?.value)}
						/>
						<label htmlFor="search" className="cursor-pointer text-[#2563EB]">
							<FaSearch title="Search Users" />
						</label>
					</div>
					<div
						ref={groupUser}
						className="flex w-full gap-1 overflow-auto px-4 py-2 scroll-style-x"
					>
						{isGroupUsers?.length != 0 &&
							isGroupUsers?.map((user) => {
								return (
									<div
										key={user?._id}
										className="flex items-center justify-center gap-1 rounded-full border border-[#D7E3FF] bg-[#EFF6FF] px-2.5 py-1.5 text-sm font-medium text-[#172033] dark:text-[#dbdee1] text-nowrap"
									>
										<h1>{user?.firstName}</h1>
										<div
											title={`Remove ${user?.firstName}`}
											onClick={() => handleRemoveGroupUser(user?._id)}
											className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-[#313338] text-[#475569] dark:text-[#b5bac1] hover:text-[#172033] dark:text-[#dbdee1]"
										>
											<MdOutlineClose size={14} />
										</div>
									</div>
								);
							})}
					</div>
					<div className="flex h-[50vh] w-full flex-col gap-1 overflow-y-auto overflow-hidden scroll-style px-4 py-2">
						{selectedUsers.length == 0 && isChatLoading ? (
							<ChatShimmer />
						) : (
							<>
								{selectedUsers?.length === 0 && (
									<div className="flex h-full w-full items-center justify-center text-[#718096]">
										<h1 className="text-base font-semibold">No users registered.</h1>
									</div>
								)}
								{selectedUsers?.map((user) => {
									return (
										<div
											key={user?._id}
											className="flex h-16 w-full cursor-pointer items-center justify-start gap-2 rounded-2xl border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] p-2 font-semibold text-[#172033] dark:text-[#dbdee1] transition-all hover:bg-[#EFF6FF]"
											onClick={() => {
												addGroupUser(user);
												setInputUserName("");
											}}
										>
											<img
												className="h-12 min-w-12 rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] object-cover"
												src={user?.image}
												alt="img"
											/>
											<div className="w-full">
												<span className="line-clamp-1 capitalize text-sm">
													{user?.firstName}{" "}
													{user?.lastName}
												</span>
												<span className="text-xs font-medium text-[#718096]">
													{SimpleDateAndTime(user?.createdAt)}
												</span>
											</div>
										</div>
									);
									})}
								</>
							)}
					</div>
				</div>
				<div className="flex w-full flex-nowrap items-center justify-center gap-2 pt-2">
					<input
						type="text"
						placeholder="Group Name"
						className="w-2/3 rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] px-3 py-2.5 text-sm text-[#172033] dark:text-[#dbdee1] outline-none placeholder:text-[#94A3B8] focus:border-[#BFDBFE]"
						onChange={(e) => setGroupName(e.target?.value)}
					/>
					<button
						className="rounded-full bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_20px_rgba(37,99,235,0.18)] transition-colors hover:bg-[#1D4ED8]"
						onClick={handleCreateGroupChat}
					>
						Create
					</button>
				</div>
				<div
					title="Close"
					onClick={() => dispatch(setGroupChatBox())}
					className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F8FAFF] dark:bg-[#2b2d31] text-[#475569] dark:text-[#b5bac1] hover:bg-[#EFF6FF] hover:text-[#172033] dark:text-[#dbdee1]"
				>
					<MdOutlineClose size={20} />
				</div>
			</div>
		</div>
	);
};

export default GroupChatBox;

