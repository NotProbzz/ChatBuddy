import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkValidSignUpFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignUp = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [load, setLoad] = useState("");
	const [isShow, setIsShow] = useState(false);
	const navigate = useNavigate();

	const signUpUser = (e) => {
		toast.loading("Wait until you SignUp");
		e.target.disabled = true;
		fetch(`/api/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
			}),
		})
			.then((response) => response.json())
			.then((json) => {
				setLoad("");
				e.target.disabled = false;
				toast.dismiss();
				if (json.token) {
					navigate("/signin");
					toast.success(json?.message);
				} else {
					toast.error(json?.message);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				setLoad("");
				toast.dismiss();
				toast.error("Error : " + error.code);
				e.target.disabled = false;
			});
	};

	const handleSignup = (e) => {
		if (firstName && lastName && email && password) {
			const validError = checkValidSignUpFrom(
				firstName,
				lastName,
				email,
				password
			);
			if (validError) {
				toast.error(validError);
				return;
			}
			setLoad("Loading...");
			signUpUser(e);
		} else {
			toast.error("Required: All Fields");
		}
	};

	return (
		<div className="my-6 flex min-h-[80vh] flex-col items-center bg-[#F8FAFF] dark:bg-[#2b2d31] text-[#172033] dark:text-[#dbdee1]">
			<div className="mt-5 h-fit w-[80%] min-w-72 max-w-[1000px] rounded-[28px] border border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] p-4 shadow-[0_28px_60px_rgba(15,23,42,0.12)] sm:w-[60%] md:w-[50%] lg:w-[40%]">
				<h2 className="mb-4 w-full text-center text-2xl font-semibold text-[#172033] dark:text-[#dbdee1]">
					SignUp ChatApp
				</h2>
				<form className="flex w-full flex-col justify-between">
					<h3 className="p-1 text-xl font-semibold text-[#172033] dark:text-[#dbdee1]">
						Enter First Name
					</h3>
					<input
						className="my-3 w-full rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] px-8 py-4 text-black outline-none placeholder:text-[#94A3B8] focus:border-[#BFDBFE]"
						type="text"
						placeholder="Enter First Name"
						name="firstName"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
					<h3 className="p-1 text-xl font-semibold text-[#172033] dark:text-[#dbdee1]">
						Enter Last Name
					</h3>
					<input
						className="my-3 w-full rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] px-8 py-4 text-black outline-none placeholder:text-[#94A3B8] focus:border-[#BFDBFE]"
						type="text"
						placeholder="Enter Last Name"
						name="lastName"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/>
					<h3 className="p-1 text-xl font-semibold text-[#172033] dark:text-[#dbdee1]">
						Enter Email Address
					</h3>
					<input
						className="my-3 w-full rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] px-8 py-4 text-black outline-none placeholder:text-[#94A3B8] focus:border-[#BFDBFE]"
						type="email"
						placeholder="Enter Email Address"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<h3 className="p-1 text-xl font-semibold text-[#172033] dark:text-[#dbdee1]">
						Enter Password
					</h3>
					<div className="relative">
						<input
							className="my-3 w-full rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] px-8 py-4 pr-12 text-black outline-none placeholder:text-[#94A3B8] focus:border-[#BFDBFE]"
							type={isShow ? "text" : "password"}
							placeholder="Enter Password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span
							onClick={() => setIsShow(!isShow)}
							className="absolute right-5 top-8 cursor-pointer text-[#475569] dark:text-[#b5bac1]"
						>
							{isShow ? (
								<PiEyeClosedLight fontSize={22} />
							) : (
								<PiEye fontSize={22} />
							)}
						</span>
					</div>
					<button
						onClick={(e) => {
							handleSignup(e);
							e.preventDefault();
						}}
						className="mt-5 w-full rounded-full border border-[#D7E3FF] bg-[#2563EB] px-5 py-4 text-lg font-semibold text-white transition-all hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{load == "" ? "SignUp" : load}
					</button>
					<div className="my-3 flex w-full items-center">
						<div className="h-[1px] w-full bg-[#E5EAF3]"></div>
						<Link to="/signin">
							<div className="p-3 text-sm font-semibold text-[#475569] dark:text-[#b5bac1] hover:text-[#172033] dark:text-[#dbdee1]">
								SignIn
							</div>
						</Link>
						<div className="h-[1px] w-full bg-[#E5EAF3]"></div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
