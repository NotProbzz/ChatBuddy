import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
	setChatLoading,
	setLoading,
	setUserSearchBox,
} from "../../redux/slices/conditionSlice";
import { toast } from "react-toastify";
import ChatShimmer from "../loading/ChatShimmer";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import socket from "../../socket/socket";

const UserSearch = () => {
	const dispatch = useDispatch();
	const isChatLoading = useSelector(
		(store) => store?.condition?.isChatLoading
	);
	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [inputUserName, setInputUserName] = useState("");
	const authUserId = useSelector((store) => store?.auth?._id);

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
	const handleCreateChat = async (userId) => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`/api/chat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				userId: userId,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addSelectedChat(json?.data));
				dispatch(setLoading(false));
				socket.emit("chat created", json?.data, authUserId);
				toast.success("Created & Selected chat");
				dispatch(setUserSearchBox());
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
				dispatch(setLoading(false));
			});
	};
	return (
		<>
			<div className="flex h-[88px] w-full items-center justify-between border-b border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] px-4 py-3 sm:px-5">
				<h1 className="mr-2 whitespace-nowrap text-lg font-semibold text-[#172033] dark:text-[#dbdee1]">New Chat</h1>
				<div className="flex w-2/3 flex-nowrap items-center gap-2">
					<input
						id="search"
						type="text"
						placeholder="Search Users..."
						className="w-full rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] px-3 py-2 text-sm text-[#172033] dark:text-[#dbdee1] outline-none placeholder:text-[#94A3B8] focus:border-[#BFDBFE]"
						onChange={(e) => setInputUserName(e.target?.value)}
					/>
					<label htmlFor="search" className="cursor-pointer text-[#2563EB]">
						<FaSearch title="Search Users" />
					</label>
				</div>
			</div>
			<div className="flex h-[calc(80vh-88px)] w-full flex-col gap-2 overflow-y-auto overflow-hidden scroll-style px-3 py-3">
				{selectedUsers.length == 0 && isChatLoading ? (
					<ChatShimmer />
				) : (
					<>
						{selectedUsers?.length === 0 && (
							<div className="flex h-full w-full items-center justify-center text-[#718096]">
								<h1 className="text-base font-medium">No users registered.</h1>
							</div>
						)}
						{selectedUsers?.map((user) => {
							return (
								<div
									key={user?._id}
									className="flex h-16 w-full cursor-pointer items-center gap-3 rounded-2xl border border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] p-2.5 transition-all hover:bg-[#F8FAFF] dark:bg-[#2b2d31]"
									onClick={() => handleCreateChat(user._id)}
								>
									<img
										className="h-12 min-w-12 rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] object-cover"
										src={user?.image}
										alt="img"
									/>
									<div className="w-full min-w-0">
										<span className="line-clamp-1 capitalize text-sm font-semibold text-[#172033] dark:text-[#dbdee1]">
											{user?.firstName} {user?.lastName}
										</span>
										<div>
											<span className="text-xs font-medium text-[#718096]">
												{SimpleDateAndTime(user?.createdAt)}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</>
				)}
			</div>
		</>
	);
};

export default UserSearch;
