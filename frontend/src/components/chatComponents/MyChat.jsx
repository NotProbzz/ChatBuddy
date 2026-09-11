import React, { useEffect } from "react";
import { FaPenAlt } from "react-icons/fa";
import DefaultAvatar from "../../assets/boy.png";
import { addMyChat, addSelectedChat } from "../../redux/slices/myChatSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setChatLoading,
  setGroupChatBox,
} from "../../redux/slices/conditionSlice";
import ChatShimmer from "../loading/ChatShimmer";
import getChatName, { getChatImage } from "../../utils/getChatName";
import { VscCheckAll } from "react-icons/vsc";
import { SimpleDateAndTime, SimpleTime } from "../../utils/formateDateTime";

const MyChat = () => {
  const dispatch = useDispatch();
  const myChat = useSelector((store) => store.myChat.chat);
  const authUserId = useSelector((store) => store?.auth?._id);
  const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
  const isChatLoading = useSelector((store) => store?.condition?.isChatLoading);
  const newMessageId = useSelector((store) => store?.message?.newMessageId);
  const isGroupChatId = useSelector((store) => store.condition.isGroupChatId);
  useEffect(() => {
    const getMyChat = () => {
      dispatch(setChatLoading(true));
      const token = localStorage.getItem("token");
      fetch(`/api/chat`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          dispatch(addMyChat(json?.data || []));
          dispatch(setChatLoading(false));
        })
        .catch((err) => {
          console.log(err);
          dispatch(setChatLoading(false));
        });
    };
    getMyChat();
  }, [newMessageId, isGroupChatId]);
  return (
    <>
      <div className="flex h-[88px] w-full items-center justify-between border-b border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] px-4 py-3 sm:px-5">
        <h1 className="mr-2 whitespace-nowrap text-lg font-semibold text-[#172033] dark:text-[#dbdee1]">My Chat</h1>
        <div
          className="flex cursor-pointer items-center gap-2 rounded-full bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white shadow-[0_12px_20px_rgba(37,99,235,0.18)] transition-all hover:bg-[#1D4ED8]"
          title="Create New Group"
          onClick={() => dispatch(setGroupChatBox())}
        >
          <h1 className="line-clamp-1 whitespace-nowrap text-sm text-white">New Group</h1>
          <FaPenAlt size={12} />
        </div>
      </div>
      <div className="flex h-[calc(80vh-88px)] w-full flex-col gap-2 overflow-y-auto overflow-hidden scroll-style px-3 py-3">
        {myChat.length == 0 && isChatLoading ? (
          <ChatShimmer />
        ) : (
          <>
            {myChat?.length === 0 && (
              <div className="flex h-full w-full items-center justify-center text-[#718096]">
                <h1 className="text-base font-medium">Start a new conversation.</h1>
              </div>
            )}
            {myChat?.map((chat) => {
              return (
                <div
                  key={chat?._id}
                  className={`flex h-20 w-full cursor-pointer items-center gap-3 rounded-2xl border p-2.5 transition-all ${
                    selectedChat?._id == chat?._id
                      ? "border-[#CFE1FF] bg-[#EFF6FF] shadow-[0_10px_25px_rgba(37,99,235,0.08)]"
                      : "border-transparent bg-white dark:bg-[#313338] hover:bg-[#F8FAFF] dark:bg-[#2b2d31]"
                  }`}
                  onClick={() => {
                    dispatch(addSelectedChat(chat));
                  }}
                >
                <img
  className="h-12 min-w-12 rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] object-cover"
  src={getChatImage(chat, authUserId)}
  alt="Profile"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = DefaultAvatar;
  }}
/>
                  <div className="w-full min-w-0">
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="line-clamp-1 flex-1 text-sm font-semibold capitalize text-[#172033] dark:text-[#dbdee1]">
                        {getChatName(chat, authUserId)}
                      </span>
                      <span className="ml-1 text-[11px] font-medium text-[#94A3B8]">
                        {chat?.latestMessage && SimpleTime(chat?.latestMessage?.createdAt)}
                      </span>
                    </div>
                    <span className="line-clamp-1 text-xs font-medium text-[#718096]">
                      {chat?.latestMessage ? (
                        <div className="flex items-end gap-1">
                          <span>
                            {chat?.latestMessage?.sender?._id === authUserId && (
                              <VscCheckAll color="#2563EB" fontSize={14} />
                            )}
                          </span>
                          <span className="line-clamp-1">{chat?.latestMessage?.message}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-[#94A3B8]">
                          {SimpleDateAndTime(chat?.createdAt)}
                        </span>
                      )}
                    </span>
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

export default MyChat;
