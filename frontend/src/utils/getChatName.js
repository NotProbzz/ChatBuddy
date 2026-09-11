import GroupLogo from "../assets/group.png";
import DefaultAvatar from "../assets/boy.png";

const getChatName = (chat, authUserId) => {
  const chatName =
    chat?.chatName === "Messenger"
      ? authUserId === chat.users[0]._id
        ? `${chat.users[1]?.firstName || ""} ${chat.users[1]?.lastName || ""}`
        : `${chat.users[0]?.firstName || ""} ${chat.users[0]?.lastName || ""}`
      : chat?.chatName;

  return chatName;
};

export const getChatImage = (chat, authUserId) => {
  if (!chat) {
    return DefaultAvatar;
  }

  // Group chat
  if (chat.chatName !== "Messenger") {
    return GroupLogo;
  }

  // One-to-one chat
  const otherUser =
    authUserId === chat.users?.[0]?._id
      ? chat.users?.[1]
      : chat.users?.[0];

  return otherUser?.image || DefaultAvatar;
};

export default getChatName;