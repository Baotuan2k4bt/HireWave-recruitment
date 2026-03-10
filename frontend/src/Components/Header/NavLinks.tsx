import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { PUBLIC_NAVIGATION_LINKS, PROTECTED_NAVIGATION_LINKS } from "../../constants/navigation-links";
import { AccountType } from "../../types/navigation.types";

const NavLinks = () => {
    const user = useSelector((state: any) => state.user || {});
    const location = useLocation();

    // Filter protected links based on user role
    const filteredProtectedLinks = user?.accountType
        ? PROTECTED_NAVIGATION_LINKS.filter((link) => 
            link.roles.includes(user.accountType as AccountType)
          )
        : [];

    // Combine public and protected links
    const filteredLinks = [...PUBLIC_NAVIGATION_LINKS, ...filteredProtectedLinks];

    const isActive = (linkUrl: string): boolean => {
        if (linkUrl === "/" || linkUrl === "") {
            return location.pathname === "/";
        }
        return location.pathname === linkUrl || location.pathname.startsWith(linkUrl + "/");
    };

    return (
        <div className="flex bs-mx:!hidden gap-5 text-deepSlate-900 h-full items-center">
            {filteredLinks.map((link) => (
                <div
                    key={link.url || "home"}
                    className={`${
                        isActive(link.url)
                            ? "border-oceanTeal-500 text-oceanTeal-500"
                            : "border-transparent"
                    } border-t-[3px] h-full flex items-center`}
                >
                    <Link className="hover:text-oceanTeal-600" to={link.url}>
                        {link.name}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default NavLinks;