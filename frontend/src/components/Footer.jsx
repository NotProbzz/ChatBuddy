import React from "react";
import { FaPenAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<div className="w-full min-h-32 border-t border-[#E5EAF3] bg-white px-4 py-8 text-[#172033] shadow-[0_-8px_24px_rgba(37,99,235,0.02)]">
			<h1 className="flex items-center gap-4 text-lg font-bold text-[#172033]">
				<span>Chat Application</span>
				<FaPenAlt fontSize={16} className="text-[#2563EB]" />
			</h1>
			<div className="flex w-full flex-wrap items-center justify-start p-4">
				<div className="my-3 flex min-w-[280px] w-[33%] flex-col text-[#475569]">
					<h1 className="mb-2 font-semibold text-[#172033]">Contact</h1>
					<span>Anirudh Pachori</span>
					<span>Indore, Madhya Pradesh</span>
					<span>Pincode - 453555</span>
					<span>
						<Link
							to={"mailto:contact.ryukop2005@gmail.com"}
							target="_blank"
							className="text-[#2563EB] hover:underline"
						>
							contact.ryukop2005@gmail.com
						</Link>
					</span>
				</div>
				<div className="my-3 flex min-w-[280px] w-[33%] flex-col text-[#475569]">
					<h1 className="mb-2 font-semibold text-[#172033]">Pages</h1>
					<span>
						<Link
							className="hover:text-[#2563EB] hover:underline"
							to={"/"}
						>
							Chat App
						</Link>
					</span>
					<span>
						<Link
							className="hover:text-[#2563EB] hover:underline"
							to={"/signin"}
						>
							SignIn
						</Link>
					</span>
					<span>
						<Link
							className="hover:text-[#2563EB] hover:underline"
							to={"/signup"}
						>
							SignUp
						</Link>
					</span>
					<span>
						<Link
							className="hover:text-[#2563EB] hover:underline"
							to={"/home"}
						>
							Home
						</Link>
					</span>
				</div>
				<div className="my-3 flex min-w-[280px] w-[33%] flex-col text-[#475569]">
					<h1 className="mb-2 font-semibold text-[#172033]">Links</h1>
					<span>
						<a
							className="hover:text-[#2563EB] hover:underline"
							href="https://www.linkedin.com/in/anirudh-pachori-365638408/?isSelfProfile=true"
							target="_blank"
							rel="noreferrer"
						>
							LinkedIn
						</a>
					</span>
					<span>
						<a
							className="hover:text-[#2563EB] hover:underline"
							href="https://github.com/NotProbzz"
							target="_blank"
							rel="noreferrer"
						>
							Github
						</a>
					</span>
					<span>
						<a
							className="hover:text-[#2563EB] hover:underline"
							href="https://www.instagram.com/blazehd01/"
							target="_blank"
							rel="noreferrer"
						>
							Instagram
						</a>
					</span>
					<span>
						<a
							className="hover:text-[#2563EB] hover:underline"
							href="mailto:contact.ryukop2005@gmail.com"
							target="_blank"
							rel="noreferrer"
						>
							E-Mail
						</a>
					</span>
				</div>
			</div>
			<h1 className="font-bold text-[#475569]">
				Open Source &copy; ChatApp
			</h1>
		</div>
	);
};

export default Footer;
