'use'
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinksProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  activeClassName?: string;
  hoverClassName?: string;
}

const NavLinks = ({
  href,
  children,
  isActive,
  className = "text-gray-700 ",
  activeClassName = "border-b-2 border-black text-black",
  hoverClassName = "hover:text-black"
}: NavLinksProps) => {
  const pathname = usePathname();

  // Auto-detect if link is active based on current path
  const isCurrentlyActive = isActive !== undefined ? isActive : pathname === href;
  return (
    <li className={`
      ${className} text-gray-700 font-medium
      ${isCurrentlyActive ? activeClassName : hoverClassName}
      transition-colors duration-200 cursor-pointer
    `}>
      <Link href={href}>
        {children}
      </Link>
    </li>
  );
}

export default NavLinks