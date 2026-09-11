import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { VscCheckAll } from "react-icons/vsc";
import { CgChevronDoubleDown } from "react-icons/cg";
import {
    SimpleDateAndTime,
    SimpleDateMonthDay,
    SimpleTime,
} from "../../utils/formateDateTime";

const AllMessages = ({ allMessage }) => {
    const chatBox = useRef();
    const adminId = useSelector((store) => store.auth?._id);
    const isTyping = useSelector((store) => store?.condition?.isTyping);

    const [scrollShow, setScrollShow] = useState(true);
    // Handle Chat Box Scroll Down
    const handleScrollDownChat = () => {
        if (chatBox.current) {
            chatBox.current.scrollTo({
                top: chatBox.current.scrollHeight,
                // behavior: "auto",
            });
        }
    };
    // Scroll Button Hidden
    useEffect(() => {
        handleScrollDownChat();
        if (chatBox.current.scrollHeight == chatBox.current.clientHeight) {
            setScrollShow(false);
        }
        const handleScroll = () => {
            const currentScrollPos = chatBox.current.scrollTop;
            if (
                currentScrollPos + chatBox.current.clientHeight <
                chatBox.current.scrollHeight - 30
            ) {
                setScrollShow(true);
            } else {
                setScrollShow(false);
            }
        };
        const chatBoxCurrent = chatBox.current;
        chatBoxCurrent.addEventListener("scroll", handleScroll);
        return () => {
            chatBoxCurrent.removeEventListener("scroll", handleScroll);
        };
    }, [allMessage, isTyping]);

    return (
        <>
            {scrollShow && (
                <div
                    className="absolute bottom-16 right-4 z-20 cursor-pointer rounded-full bg-white dark:bg-[#313338] p-1.5 text-[#2563EB] shadow-[0_14px_28px_rgba(15,23,42,0.12)] hover:bg-[#EFF6FF]"
                    onClick={handleScrollDownChat}
                >
                    <CgChevronDoubleDown title="Scroll Down" fontSize={22} />
                </div>
            )}
            <div
                className="flex h-[calc(80vh-176px)] w-full flex-col gap-1 overflow-y-auto overflow-hidden scroll-style bg-[#F8FAFF] dark:bg-[#2b2d31] px-3 py-3"
                ref={chatBox}
            >
                {allMessage?.map((message, idx) => {
                    return (
                        <Fragment key={message._id}>
                            <div className="sticky top-0 z-10 flex w-full justify-center">
                                {new Date(
                                    allMessage[idx - 1]?.updatedAt
                                ).toDateString() !==
                                    new Date(
                                        message?.updatedAt
                                    ).toDateString() && (
                                    <span className="mb-2 mt-1 flex h-7 w-fit items-center justify-center rounded-full bg-[#EEF4FF] px-4 text-[11px] font-medium text-[#6B7280] shadow-sm">
                                        {SimpleDateMonthDay(message?.updatedAt)}
                                    </span>
                                )}
                            </div>
                            <div
                                className={`flex items-start gap-1.5 ${
                                    message?.sender?._id === adminId
                                        ? "flex-row-reverse text-white"
                                        : "flex-row text-black"
                                }`}
                            >
                                {message?.chat?.isGroupChat &&
                                    message?.sender?._id !== adminId &&
                                    (allMessage[idx + 1]?.sender?._id !==
                                    message?.sender?._id ? (
                                        <img
                                            src={message?.sender?.image}
                                            alt=""
                                            className="h-8 w-8 rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] object-cover"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full"></div>
                                    ))}
                                <div
                                    className={`relative flex min-w-10 max-w-[85%] flex-col rounded-2xl px-3 py-2 shadow-sm ${
                                        message?.sender?._id === adminId
                                            ? "bg-[#2563EB] text-white rounded-br-md"
                                            : "border border-[#E8ECF7] bg-[#F3F6FB] text-[#172033] dark:text-[#dbdee1] rounded-bl-md"
                                    }`}
                                >
                                    {message?.chat?.isGroupChat &&
                                        message?.sender?._id !== adminId && (
                                            <span className="mb-1 text-[11px] font-semibold text-[#2563EB]">
                                                {message?.sender?.firstName}
                                            </span>
                                        )}
                                    <div
                                        className={`pb-4 ${
                                            message?.sender?._id == adminId
                                                ? "pr-12"
                                                : "pr-12"
                                        }`}
                                    >
                                        <span className="break-words text-[15px] leading-6">
                                            {message?.message}
                                        </span>
                                        <span
                                            className={`absolute bottom-1.5 flex items-end gap-1 text-[10px] ${
                                                message?.sender?._id === adminId
                                                    ? "right-2 text-blue-100"
                                                    : "right-2 text-[#718096]"
                                            }`}
                                            title={SimpleDateAndTime(
                                                message?.updatedAt
                                            )}
                                        >
                                            {SimpleTime(message?.updatedAt)}
                                            {message?.sender?._id ===
                                                adminId && (
                                                <VscCheckAll
                                                    color={
                                                        message?.sender?._id ===
                                                        adminId
                                                            ? "#E0F2FE"
                                                            : "#718096"
                                                    }
                                                    fontSize={14}
                                                />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    );
                })}
                {isTyping && (
                    <div id="typing-animation">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
            </div>
        </>
    );
};

export default AllMessages;
