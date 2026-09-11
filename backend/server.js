const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const corsOptions = {
	origin: [process.env.FRONTEND_URL,"https://bench-mate-seven.vercel.app", "http://localhost:5173"],
	methods: ["GET", "POST", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;

// All routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");

// Connect to Database
mongoose.set('bufferCommands', false);

async function connectDB() {
  console.log("Starting in-memory MongoDB (external connections are blocked)...");
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  
  mongoose.connect(mongoUri)
    .then(() => console.log(`Database Connection established to in-memory DB`))
    .catch((err) => console.error('Database connection error:', err));
}

connectDB();

// Root route
app.get("/api/", (req, res) => {
	res.json({
		message: "Welcome to Chat Application API!",
	});
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});


// All routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

// API Not found routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// SPA routing
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || (err.message && err.message.includes('buffering timed out'))) {
    console.warn('[AI Studio] Database offline — returning mock empty response');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ message: 'Service temporarily unavailable (database offline)' });
  }
	const errorMessage = err.message || "Something Went Wrong!";
	res.status(500).json({ message: errorMessage });
});

// Start the server
const server = app.listen(PORT, "0.0.0.0", async () => {
	console.log(`Server listening on ${PORT}`);
});

// Socket.IO setup
const { Server } = require("socket.io");
const io = new Server(server, {
	pingTimeout: 60000,
	transports: ["websocket"],
	cors: corsOptions,
});

// Socket connection
io.on("connection", (socket) => {
	console.log("Connected to socket.io:", socket.id);

	// Join user and message send to client
	const setupHandler = (userId) => {
		if (!socket.hasJoined) {
			socket.join(userId);
			socket.hasJoined = true;
			console.log("User joined:", userId);
			socket.emit("connected");
		}
	};
	const newMessageHandler = (newMessageReceived) => {
		let chat = newMessageReceived?.chat;
		chat?.users.forEach((user) => {
			if (user._id === newMessageReceived.sender._id) return;
			console.log("Message received by:", user._id);
			socket.in(user._id).emit("message received", newMessageReceived);
		});
	};

	// Join a Chat Room and Typing effect
	const joinChatHandler = (room) => {
		if (socket.currentRoom) {
			if (socket.currentRoom === room) {
				console.log(`User already in Room: ${room}`);
				return;
			}
			socket.leave(socket.currentRoom);
			console.log(`User left Room: ${socket.currentRoom}`);
		}
		socket.join(room);
		socket.currentRoom = room;
		console.log("User joined Room:", room);
	};
	const typingHandler = (room) => {
		socket.in(room).emit("typing");
	};
	const stopTypingHandler = (room) => {
		socket.in(room).emit("stop typing");
	};

	// Clear, Delete and Create chat handlers
	const clearChatHandler = (chatId) => {
		socket.in(chatId).emit("clear chat", chatId);
	};
	const deleteChatHandler = (chat, authUserId) => {
		chat.users.forEach((user) => {
			if (authUserId === user._id) return;
			console.log("Chat delete:", user._id);
			socket.in(user._id).emit("delete chat", chat._id);
		});
	};
	const chatCreateChatHandler = (chat, authUserId) => {
		chat.users.forEach((user) => {
			if (authUserId === user._id) return;
			console.log("Create chat:", user._id);
			socket.in(user._id).emit("chat created", chat);
		});
	};

	socket.on("setup", setupHandler);
	socket.on("new message", newMessageHandler);
	socket.on("join chat", joinChatHandler);
	socket.on("typing", typingHandler);
	socket.on("stop typing", stopTypingHandler);
	socket.on("clear chat", clearChatHandler);
	socket.on("delete chat", deleteChatHandler);
	socket.on("chat created", chatCreateChatHandler);

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
		socket.off("setup", setupHandler);
		socket.off("new message", newMessageHandler);
		socket.off("join chat", joinChatHandler);
		socket.off("typing", typingHandler);
		socket.off("stop typing", stopTypingHandler);
		socket.off("clear chat", clearChatHandler);
		socket.off("delete chat", deleteChatHandler);
		socket.off("chat created", chatCreateChatHandler);
	});
});
