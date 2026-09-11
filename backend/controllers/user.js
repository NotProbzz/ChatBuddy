const User = require("../models/user");

const getAuthUser = async (req, res) => {
	if (!req.user) {
		return res.status(404).json({ message: `User Not Found` });
	}
	res.status(200).json({
		data: req.user,
	});
};

const getAllUsers = async (req, res) => {
	const allUsers = await User.find({ _id: { $ne: req.user._id } })
		.select("-password")
		.sort({ _id: -1 });
	res.status(200).send({ data: allUsers });
};

const updateProfile = async (req, res) => {
	const { image, gender } = req.body;
	const user = await User.findById(req.user._id);
	if (!user) {
		return res.status(404).json({ message: "User Not Found" });
	}
	if (image) user.image = image;
	if (gender) user.gender = gender;
	await user.save();
	res.status(200).json({ message: "Profile Updated", data: user });
};

module.exports = { getAuthUser, getAllUsers, updateProfile };
