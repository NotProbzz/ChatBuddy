import React, { useEffect, useRef, useState } from "react";
import DefaultAvatar from "../assets/boy.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
// Removed Logo import
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdNotificationsActive,
	MdOutlineDarkMode,
	MdOutlineLightMode,
} from "react-icons/md";
import {
	setHeaderMenu,
	setLoading,
	setNotificationBox,
	setProfileDetail,
} from "../redux/slices/conditionSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";

const Header = () => {
	const user = useSelector((store) => store.auth);
	const isHeaderMenu = useSelector((store) => store?.condition?.isHeaderMenu);
	const newMessageRecieved = useSelector(
		(store) => store?.myChat?.newMessageRecieved
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	
	const [isDark, setIsDark] = useState(() => {
	    return localStorage.getItem("theme") === "dark" || false;
	});

	useEffect(() => {
	    if (isDark) {
	        document.documentElement.classList.add("dark");
	        localStorage.setItem("theme", "dark");
	    } else {
	        document.documentElement.classList.remove("dark");
	        localStorage.setItem("theme", "light");
	    }
	}, [isDark]);

	const getAuthUser = (token) => {
		dispatch(setLoading(true));
		fetch(`/api/user/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addAuth(json.data));
				dispatch(setLoading(false));
			})
			.catch((err) => {
				console.log(err);
				dispatch(setLoading(false));
			});
	};
	useEffect(() => {
		if (token) {
			getAuthUser(token);
			navigate("/");
		} else {
			navigate("/signin");
		}
		dispatch(setHeaderMenu(false));
	}, [token]);

	// Scroll to top of page && Redirect Auth change --------------------------------
	const { pathname } = useLocation();
	useEffect(() => {
		if (user) {
			navigate("/");
		} else if (pathname !== "/signin" && pathname !== "/signup") {
			navigate("/signin");
		}
		handleScrollTop();
	}, [pathname, user]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
		navigate("/signin");
	};

	useEffect(() => {
		var prevScrollPos = window.pageYOffset;
		const handleScroll = () => {
			var currentScrollPos = window.pageYOffset;
			if (prevScrollPos < currentScrollPos && currentScrollPos > 80) {
				document.getElementById("header").classList.add("hiddenbox");
			} else {
				document.getElementById("header").classList.remove("hiddenbox");
			}
			prevScrollPos = currentScrollPos;
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const headerMenuBox = useRef(null);
	const headerUserBox = useRef(null);
	// headerMenuBox outside click handler
	const handleClickOutside = (event) => {
		if (
			headerMenuBox.current &&
			!headerUserBox?.current?.contains(event.target) &&
			!headerMenuBox.current.contains(event.target)
		) {
			dispatch(setHeaderMenu(false));
		}
	};

	// add && remove events according to isHeaderMenu
	useEffect(() => {
		if (isHeaderMenu) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isHeaderMenu]);
	return (
		<div
			id="header"
			className="w-full h-16 fixed top-0 z-50 md:h-20 flex justify-between items-center px-4 py-3 font-semibold bg-white dark:bg-[#313338] text-[#172033] dark:text-[#dbdee1] border-b border-[#E5EAF3] dark:border-[#1e1f22] shadow-[0_8px_24px_rgba(37,99,235,0.04)] transition-all duration-200"
		>
			<div className="flex items-center justify-start gap-2.5">
				<Link to={"/"} className="flex items-center gap-2.5">
					<img
						src="/logo.png"
						alt="ChatBuddy Logo"
						className="h-11 w-11 rounded-full border border-transparent object-cover shadow-sm"
					/>
					<span className="text-lg tracking-tight text-[#172033] dark:text-[#dbdee1]">
						ChatBuddy
					</span>
				</Link>
			</div>

			{user ? (
				<div className="flex flex-nowrap items-center gap-3">
					<button
						onClick={() => setIsDark(!isDark)}
						className="flex items-center justify-center p-2 rounded-full hover:bg-[#F8FAFF] dark:hover:bg-[#2b2d31] text-[#475569] dark:text-[#b5bac1] transition-colors"
						title="Toggle Dark Mode"
					>
						{isDark ? <MdOutlineLightMode fontSize={24} /> : <MdOutlineDarkMode fontSize={24} />}
					</button>
					<span
						className={`relative flex items-center justify-center cursor-pointer text-[#2563EB] ${
							newMessageRecieved.length > 0 ? "animate-bounce" : "animate-none"
						}`}
						title={`You have ${newMessageRecieved.length} new notifications`}
						onClick={() => dispatch(setNotificationBox(true))}
					>
						<MdNotificationsActive fontSize={24} />
						{newMessageRecieved.length > 0 && (
							<span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-bold text-white">
								{newMessageRecieved.length}
							</span>
						)}
					</span>
					<span className="whitespace-nowrap text-sm font-medium text-[#475569] dark:text-[#b5bac1]">
						Hi, {user.firstName}
					</span>
					<div
						ref={headerUserBox}
						onClick={(e) => {
							e.preventDefault();
							dispatch(setHeaderMenu(!isHeaderMenu));
						}}
						className="flex flex-nowrap items-center gap-1 rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] bg-[#F8FAFF] dark:bg-[#2b2d31] px-1.5 py-1 shadow-sm transition-all cursor-pointer hover:border-[#BFD3FF] hover:bg-[#EFF6FF]"
					>
					<img
  src={user?.image || DefaultAvatar}
  alt="Profile"
  onError={(e) => {
    e.currentTarget.src = DefaultAvatar;
  }}
  className="h-9 w-9 rounded-full border border-[#E5EAF3] dark:border-[#1e1f22] object-cover"
/>
						<span className="text-[#2563EB]">
							{isHeaderMenu ? (
								<MdKeyboardArrowDown fontSize={20} />
							) : (
								<MdKeyboardArrowUp fontSize={20} />
							)}
						</span>
					</div>
					{isHeaderMenu && (
						<div
							ref={headerMenuBox}
							className="absolute right-4 top-16 z-40 flex w-40 flex-col overflow-hidden rounded-xl border border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] py-2 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
						>
							<div
								onClick={() => {
									dispatch(setHeaderMenu(false));
									dispatch(setProfileDetail());
								}}
								className="flex w-full cursor-pointer items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-[#172033] dark:text-[#dbdee1] transition-colors hover:bg-[#EFF6FF] hover:text-[#2563EB]"
							>
								<PiUserCircleLight fontSize={22} />
								<span>Profile</span>
							</div>
							<div
								className="flex w-full cursor-pointer items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-[#172033] dark:text-[#dbdee1] transition-colors hover:bg-[#EFF6FF] hover:text-[#2563EB]"
								onClick={handleLogout}
							>
								<IoLogOutOutline fontSize={20} />
								<span>Logout</span>
							</div>
						</div>
					)}
				</div>
			) : (
				<Link to={"/signin"}>
					<button className="rounded-full border border-[#D7E3FF] bg-[#EFF6FF] px-4 py-2 text-sm font-semibold text-[#2563EB] shadow-sm transition-colors hover:bg-[#DBEAFE]">
						SignIn
					</button>
				</Link>
			)}
		</div>
	);
};

export default Header;
