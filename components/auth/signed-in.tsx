"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, LogIn, LogOut, Settings, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const Signed = () => {
    const { data: session, status } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);
    const { theme } = useTheme();
    const router = useRouter()
    
    const  image = session?.user?.image
    process.env.NODE_ENV === 'development' && console.log(image)
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();
    
    // Sign-out handler
    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
            dropdownRef.current &&
            buttonRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setShowDropdown(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    // Dropdown menu options
    const dropdownItems = [
        { icon: <User className="mr-2 h-4 w-4" />, text: "Profile", onClick: () => {} },
        { icon: <Settings className="mr-2 h-4 w-4" />, text: "Settings", onClick: () => {} },
        { icon: <LogIn className="mr-2 h-4 w-4" />, text: "Sign In", onClick: () => router.push("/sign-in") },
    ];

    if (status === "loading") {
        return <Loader className="size-6 mr-4 mt-4 float-right animate-spin" />;
    }

    return (
        <nav>

                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="outline-none relative float-right flex flex-1 flex-shrink">
                        <div ref={buttonRef} className="flex gap-4 items-center cursor-pointer">
                            <Avatar className="hover:opacity-75 transition w-12 h-12 ">
                                <AvatarImage
                                    src={session?.user?.image || undefined}
                                    className="hover:opacity-75 transition "
                                />
                                <AvatarFallback className={`${theme === 'dark' ? 'bg-gray-100 text-gray-800' : ' bg-gray-800 text-green-100'} text-white`}>
                                    { status === "authenticated" ? 
                                    avatarFallback : 
                                    <User className={`${theme === 'dark' ? 'text-black' : 'text-white'} w-6 h-6`} />
                                    
                                    }
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent ref={dropdownRef} align="center" side="bottom" className="w-50">
                        <div
                            className={`px-4 py-3 border-b ${
                                theme === "dark" 
                                ? "border-gray-700 text-gray-100"
                                : "border-gray-300 text-gray-800" 
                            } text-center font-semibold`}
                        >
                            Welcome to Neurolov
                        </div>
                        {
                            status === "authenticated" ? 
                            (

                                <div className="py-1">
                            <DropdownMenuItem
                                className="h-10 flex items-center cursor-pointer"
                                onClick={() => {
                                    handleSignOut();
                                    setShowDropdown(false);
                                }}
                                >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sign Out</span>
                            </DropdownMenuItem>
                        </div>
                                ) : (
                                        dropdownItems.map((item, index) => (
                                          <DropdownMenuItem
                                              key={index}
                                              className="h-10 flex items-center cursor-pointer text-md"
                                              onClick={() => {
                                                  item.onClick();
                                                  setShowDropdown(false);
                                              }}
                                          >
                                              {item.icon}
                                              <span className="">{item.text}</span>
                                          </DropdownMenuItem>
                                      ))
                                )
                        }
                    </DropdownMenuContent>
                </DropdownMenu>

        </nav>
    );
};

export default Signed;
