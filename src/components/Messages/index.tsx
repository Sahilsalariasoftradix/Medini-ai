import { Avatar, Box, Typography, IconButton } from "@mui/material";

import { useState } from "react";
import CommonButton from "../common/CommonButton";
import emojiIcon from "../../assets/icons/mood-smile.svg";
import file from "../../assets/icons/link.svg";
import photo from "../../assets/icons/photo.svg";
import share from "../../assets/icons/share.svg";
import search from "../../assets/icons/Search.svg";
import CommonTextField from "../common/CommonTextField";
import useDebounce from "../../hooks/useDebounce";
import { mockContacts, mockMessages } from "../../utils/common";
const sidebarStyles = {
  width: 350,
  borderRight: "1px solid #E2E8F0",
  overflow: "auto",
  display: { xs: "none", sm: "block" },
  scrollbarWidth: "thin",
  scrollbarColor: "transparent transparent",
  "&::-webkit-scrollbar": {
    width: 8,
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "transparent",
    borderRadius: 4,
    transition: "background-color 0.2s",
  },
  "&:hover::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  "&:hover": {
    scrollbarColor: "rgba(0,0,0,0.2) transparent",
  },
};
const messageAreaStyles = {
  flexGrow: 1,
  py: 2,
  px: 4,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "transparent",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  scrollbarWidth: "thin",
  scrollbarColor: "transparent transparent",
  "&:hover": {
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    scrollbarColor: "rgba(0,0,0,0.2) transparent",
  },
};

const Messages = () => {
  const [message, setMessage] = useState("");
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 140px)",
        borderTop: "1px solid #E2E8F0",
      }}
    >
      {/* Left sidebar - contact list */}
      <Box sx={sidebarStyles}>
        <Box sx={{ p: 2 }}>
          <CommonTextField
            placeholder="Search..."
            startIcon={<img src={search} alt="search" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Box>

        {/* Contact list items */}
        <Box>
          {mockContacts
            .filter((contact) =>
              contact.name
                .toLowerCase()
                .includes(debouncedSearchValue.toLowerCase())
            )
            .map((contact) => (
              <Box
                key={contact.id}
                sx={{
                  display: "flex",
                  p: 2,
                  borderBottom: "1px solid #f5f5f5",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                  // Highlight active chat - can be controlled with state
                  ...(contact.id === 3
                    ? { bgcolor: "rgba(0, 0, 0, 0.04)" }
                    : {}),
                }}
              >
                <Avatar
                  sx={{ bgcolor: contact.avatarColor, width: 40, height: 40 }}
                >
                  {contact.name.charAt(0)}
                </Avatar>
                <Box sx={{ ml: 1.5, overflow: "hidden", flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="bodyLargeExtraBold" noWrap>
                      {contact.name}
                    </Typography>
                    <Typography variant="bodyMediumMedium">
                      {contact.time}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="bodyMediumMedium"
                      noWrap
                      sx={{
                        maxWidth: "150px",
                        ...(contact.unreadCount > 0
                          ? { fontWeight: 500, color: "text.primary" }
                          : {}),
                      }}
                    >
                      {contact.lastMessage}
                    </Typography>
                    {contact.unreadCount > 0 && (
                      <Box
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      >
                        {contact.unreadCount}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>

      {/* Right side - chat area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Chat header */}
        <Box
          sx={{
            px: 4,
            py: 3,
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ bgcolor: "#f50057", mr: 2 }}>SC</Avatar>
          <Typography variant="subtitle1" fontWeight="bold">
            Spencer Connelly
          </Typography>
        </Box>

        {/* Messages area */}
        <Box sx={messageAreaStyles}>
          {mockMessages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                flexDirection: "column",

                alignItems: msg.isUser ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: msg.isUser ? "flex-end" : "flex-start",
                }}
              >
                {/* {!msg.isUser && (
                  <Avatar
                    sx={{ width: 32, height: 32, mr: 1, bgcolor: "#9c27b0" }}
                  >
                    {msg.sender.charAt(0)}
                  </Avatar>
                )} */}
                {msg.isUser && (
                  <IconButton size="small" sx={{ ml: 1, opacity: 0.6 }}>
                    <img src={share} alt="share" />
                  </IconButton>
                )}
                <Box
                  sx={{
                    maxWidth: "70%",
                    p: 1.5,
                    borderRadius: "16px",
                    borderBottomRightRadius: 0,
                    bgcolor: msg.isUser ? "primary.main" : "grey.100",
                    color: msg.isUser ? "white" : "inherit",
                  }}
                >
                  <Typography variant="body1">{msg.content}</Typography>
                </Box>

                {!msg.isUser && (
                  <IconButton size="small" sx={{ ml: 1, opacity: 0.6 }}>
                    <img src={share} alt="share" />
                  </IconButton>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",

                  mt: 0.5,
                  ml: msg.isUser ? 0 : 0,
                }}
              >
                {!msg.isUser && (
                  <Typography
                    variant="bodySmallExtraBold"
                    sx={{ mx: 1, mb: 0.5 }}
                  >
                    {msg.sender}
                  </Typography>
                )}
                {msg.reactions.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      mr: 1,
                      p: 0.5,
                      borderRadius: "50px",
                      bgcolor: "grey.100",
                      border: "1px solid #936DFF",
                      minWidth: "50px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {msg.reactions.map((reaction, i) => (
                      <Typography key={i} variant="body2" sx={{ mx: 0.25 }}>
                        {reaction}
                      </Typography>
                    ))}
                  </Box>
                )}
                <Typography variant="bodySmallMedium" color="grey.500">
                  {msg.timestamp}{" "}
                </Typography>
                <Typography variant="bodySmallExtraBold" ml={1}>
                  {msg.isUser && "You"}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Message input area */}
        <Box sx={{ px: 6 }}>
          <CommonTextField
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
        </Box>
        <Box
          sx={{
            py: 2,
            px: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <IconButton>
              <img src={photo} alt="photo" />
            </IconButton>
            <IconButton>
              <img src={file} alt="file" />
            </IconButton>
            <IconButton>
              <img src={emojiIcon} alt="emoji" />
            </IconButton>
          </Box>

          <CommonButton
            text="Send"
            onClick={handleSend}
            disabled={!message.trim()}
            sx={{ width: "150px" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Messages;
