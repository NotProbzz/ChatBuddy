import React from "react";
import { FaPenAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<div className="w-full min-h-32 border-t border-[#E5EAF3] dark:border-[#1e1f22] bg-white dark:bg-[#313338] px-4 py-8 text-[#172033] dark:text-[#dbdee1] shadow-[0_-8px_24px_rgba(37,99,235,0.02)]">
			<h1 className="flex items-center gap-4 text-lg font-bold text-[#172033] dark:text-[#dbdee1]">
				<span>Chat Application</span>
				<FaPenAlt fontSize={16} className="text-[#2563EB]" />
			</h1>
			<div className="flex w-full flex-wrap items-center justify-start p-4">
				<div className="my-3 flex min-w-[280px] w-[33%] flex-col text-[#475569] dark:text-[#b5bac1]">
					<h1 className="mb-2 font-semibold text-[#172033] dark:text-[#dbdee1]">Contact</h1>
					<span>Achint Choudhary</span>
					<span>Indore, Madhya Pradesh</span>
					<span>Pincode - 453555</span>
					<span>
						<Link
							to={"mailto:contact.achintchoudhary10@gmail.com"}
							target="_blank"
							className="text-[#2563EB] hover:underline"
						>
							contact.achintchoudhary10@gmail.com
						</Link>
					</span>
				</div>
				<div className="my-3 flex min-w-[280px] w-[33%] flex-col text-[#475569] dark:text-[#b5bac1]">
					<h1 className="mb-2 font-semibold text-[#172033] dark:text-[#dbdee1]">Pages</h1>
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
				<div className="my-3 flex min-w-[280px] w-[33%] flex-col text-[#475569] dark:text-[#b5bac1]">
					<h1 className="mb-2 font-semibold text-[#172033] dark:text-[#dbdee1]">Links</h1>
					<span>
						<a
							className="hover:text-[#2563EB] hover:underline"
							href="https://www.linkedin.com/in/achint-choudhary-6228542b7/"
							target="_blank"
							rel="noreferrer"
						>
							LinkedIn
						</a>
					</span>
					<span>
						<a
							className="hover:text-[#2563EB] hover:underline"
							href="https://github.com/AchintChoudhary"
							target="_blank"
							rel="noreferrer"
						>
							Github
						</a>
					</span>
					<span>
						<a
							className="hover:text-[#2563EB] hover:underline"
							href="https://www.instagram.com/achint_1611?igsi=MTN1cjA1cXdvM3RrMQ=="
							target="_blank"
							rel="noreferrer"
						>
							Instagram
						</a>
					</span>
					<span>
						<a
							className="hover:text-[#2563EB] hover:underline"
							href="mailto:contact.achintchoudhary10@gmail.com"
							target="_blank"
							rel="noreferrer"
						>
							E-Mail
						</a>
					</span>
				</div>
			</div>
			<h1 className="font-bold text-[#475569] dark:text-[#b5bac1]">
				Open Source &copy; ChatApp
			</h1>
		</div>
	);
};

export default Footer;
