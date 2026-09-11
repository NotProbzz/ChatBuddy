import React, { useState } from "react";
import { MdOutlineClose, MdEdit } from "react-icons/md";
import DefaultAvatar from "../assets/boy.png";
import { useDispatch, useSelector } from "react-redux";
import { setProfileDetail } from "../redux/slices/conditionSlice";
import { addAuth } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

const ProfileDetail = () => {
	const dispatch = useDispatch();
	const user = useSelector((store) => store.auth);
	const [isEditing, setIsEditing] = useState(false);
	const [image, setImage] = useState(user.image || "");
	const [gender, setGender] = useState(user.gender || "");
	const [loading, setLoading] = useState(false);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUpdate = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/user/profile", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({ image, gender })
			});
			const data = await res.json();
			if (res.ok) {
				toast.success("Profile Updated");
				dispatch(addAuth(data.data));
				setIsEditing(false);
			} else {
				toast.error(data.message || "Failed to update profile");
			}
		} catch (error) {
			toast.error("Error updating profile");
		}
		setLoading(false);
	};

	return (
		<div className="fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center bg-[#0F172A]/20 p-4 backdrop-blur-[2px]">
			<div className="relative mt-5 h-fit w-[80%] min-w-72 max-w-[1000px] rounded-[28px] border border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] p-3 pt-4 shadow-[0_28px_60px_rgba(15,23,42,0.14)] sm:w-[60%] md:w-[50%] lg:w-[40%]">
				<h2 className="mb-2 w-full text-center text-2xl font-semibold text-[#172033] dark:text-[#dbdee1]">
					Profile
				</h2>
				<div className="flex w-full flex-wrap items-center justify-evenly gap-3 py-4">
					<div className="flex flex-col gap-4 self-end">
						<h3 className="p-1 text-xl font-semibold text-[#172033] dark:text-[#dbdee1]">
							Name : {user.firstName} {user.lastName}
						</h3>
						<h3 className="p-1 text-xl font-semibold text-[#172033] dark:text-[#dbdee1]">
							Email : {user.email}
						</h3>
						
						{isEditing ? (
							<div className="flex flex-col gap-2 mt-2">
								<label className="text-sm font-semibold text-[#172033] dark:text-[#dbdee1]">Gender</label>
								<select
									value={gender}
									onChange={(e) => setGender(e.target.value)}
									className="rounded-lg border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] p-2 text-[#172033] dark:text-[#dbdee1] outline-none"
								>
									<option value="">Select Gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
							</div>
						) : (
							<h3 className="p-1 text-xl font-semibold text-[#172033] dark:text-[#dbdee1]">
								Gender : {user.gender || "Not specified"}
							</h3>
						)}

						<button
							onClick={() => {
								localStorage.removeItem("token");
								window.location.reload();
							}}
							className="mt-3 hidden rounded bg-red-500 px-4 py-1.5 font-bold text-white hover:bg-red-700 sm:block"
						>
							Logout
						</button>
					</div>

					<div className="flex w-full items-center justify-evenly self-end sm:w-fit sm:flex-col gap-4">
						<div className="relative">
							<img
								src={isEditing ? (image || DefaultAvatar) : (user?.image || DefaultAvatar)}
								alt="Profile"
								onError={(e) => {
									e.currentTarget.src = DefaultAvatar;
								}}
								className="h-24 w-24 rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] object-cover"
							/>
							{isEditing && (
								<label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#2563EB] p-1.5 text-white shadow-md hover:bg-[#1D4ED8]">
									<MdEdit size={16} />
									<input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
								</label>
							)}
						</div>
						
						<div className="flex flex-col gap-2 mt-3">
							{isEditing ? (
								<div className="flex gap-2">
									<button
										onClick={() => setIsEditing(false)}
										className="rounded border border-[#E5EAF3] dark:border-[#1e1f22] px-4 py-1.5 font-bold text-[#475569] dark:text-[#b5bac1] hover:bg-[#F8FAFF] dark:hover:bg-[#2b2d31]"
									>
										Cancel
									</button>
									<button
										onClick={handleUpdate}
										disabled={loading}
										className="rounded bg-[#2563EB] px-4 py-1.5 font-bold text-white hover:bg-[#1D4ED8]"
									>
										{loading ? "Saving..." : "Save"}
									</button>
								</div>
							) : (
								<button
									onClick={() => setIsEditing(true)}
									className="rounded bg-[#2563EB] px-4 py-1.5 font-bold text-white hover:bg-[#1D4ED8]"
								>
									Edit Profile
								</button>
							)}
							<button
								onClick={() => {
									localStorage.removeItem("token");
									window.location.reload();
								}}
								className="mt-2 rounded bg-red-500 px-4 py-1.5 font-bold text-white hover:bg-red-700 sm:hidden"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
				<div
					title="Close"
					onClick={() => dispatch(setProfileDetail())}
					className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F8FAFF] dark:bg-[#2b2d31] text-[#475569] dark:text-[#b5bac1] hover:bg-[#EFF6FF] hover:text-[#172033] dark:hover:text-[#dbdee1]"
				>
					<MdOutlineClose size={20} />
				</div>
			</div>
		</div>
	);
};

export default ProfileDetail;
