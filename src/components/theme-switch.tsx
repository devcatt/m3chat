"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { buttonVariants } from "./ui/button";

export default function ThemeSwitch() {
	const { setTheme } = useTheme();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={`fixed right-2 top-2 cursor-pointer ${buttonVariants({ variant: "ghost" })}`}
			>
				<Sun />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="flex flex-col w-min p-2 gap-2">
				<DropdownMenuItem
					className={`cursor-pointer w-full justify-center ${buttonVariants({ variant: "outline" })}`}
					onClick={() => setTheme("light")}
				>
					<Sun />
				</DropdownMenuItem>
				<DropdownMenuItem
					className={`cursor-pointer w-full justify-center ${buttonVariants({ variant: "outline" })}`}
					onClick={() => setTheme("dark")}
				>
					<Moon />
				</DropdownMenuItem>
				<DropdownMenuItem
					className={`cursor-pointer w-full justify-center ${buttonVariants({ variant: "outline" })}`}
					onClick={() => setTheme("system")}
				>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
