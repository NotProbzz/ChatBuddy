import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addSelectedChat,
	removeNewMessageRecieved,
} from "../redux/slices/myChatSlice";
import { setNotificationBox } from "../redux/slices/conditionSlice";
import { MdOutlineClose } from "react-icons/md";
import { SimpleDateAndTime } from "../utils/formateDateTime";
import getChatName from "../utils/getChatName";

const NotificationBox = () => {
	const authUserId = useSelector((store) => store?.auth?._id);
	const dispatch = useDispatch();
	const newMessageRecieved = useSelector(
		(store) => store?.myChat?.newMessageRecieved
	);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/20 p-4 backdrop-blur-[2px]">
			<div className="relative mt-5 h-fit w-[80%] min-w-72 max-w-[1000px] rounded-[28px] border border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] p-3 pt-4 shadow-[0_28px_60px_rgba(15,23,42,0.14)] sm:w-[60%] md:w-[50%] lg:w-[40%]">
				<h2 className="mb-2 w-full text-center text-2xl font-semibold text-[#172033] dark:text-[#dbdee1]">
					Notification
				</h2>
				{newMessageRecieved.length > 0 && (
					<p className="px-4 pt-2 text-sm text-[#475569] dark:text-[#b5bac1]">
						You have {newMessageRecieved.length} new notifications
					</p>
				)}
				<div className="flex w-full flex-wrap items-center justify-evenly gap-3 py-4">
					<div className="flex h-[50vh] w-full flex-col gap-1 overflow-y-auto overflow-hidden scroll-style px-4 py-2">
						{newMessageRecieved.length == 0 && false ? (
							<div>Shimmer</div>
						) : (
							<>
								{newMessageRecieved?.length === 0 && (
									<div className="flex h-full w-full items-center justify-center text-[#718096]">
										<h1 className="text-base font-semibold">
											You have 0 new notifications
										</h1>
									</div>
								)}
								{newMessageRecieved?.map((message) => {
									return (
										<div
											key={message?._id}
											className="flex h-16 w-full cursor-pointer items-center justify-start gap-2 rounded-2xl border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] p-2 font-normal text-[#172033] dark:text-[#dbdee1] transition-all hover:bg-[#EFF6FF]"
											onClick={() => {
												dispatch(removeNewMessageRecieved(message));
												dispatch(addSelectedChat(message?.chat));
												dispatch(setNotificationBox(false));
											}}
										>
											<div className="w-full">
												<span className="line-clamp-1 capitalize text-sm text-[#172033] dark:text-[#dbdee1]">
													New message{" "}
													{message?.chat?.isGroupChat &&
														"in " + getChatName(message?.chat, authUserId)}{" "}
													from{" "}
													{message?.sender?.firstName}{" "}
													:{" "}
													<span className="text-[#2563EB]">{message?.message}</span>
												</span>
												<span className="text-xs font-light text-[#718096]">
													{SimpleDateAndTime(message?.createdAt)}
												</span>
											</div>
										</div>
									);
									})}
								</>
							)}
					</div>
				</div>
				<div
					title="Close"
					onClick={() => dispatch(setNotificationBox(false))}
					className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F8FAFF] dark:bg-[#2b2d31] text-[#475569] dark:text-[#b5bac1] hover:bg-[#EFF6FF] hover:text-[#172033] dark:text-[#dbdee1]"
				>
					<MdOutlineClose size={20} />
				</div>
			</div>
		</div>
	);
};

export default NotificationBox;

