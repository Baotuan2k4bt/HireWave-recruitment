import { Avatar, Burger, Button, Drawer, Indicator } from "@mantine/core";
import { IconAnchor, IconAsset, IconBell, IconSettings, IconX } from "@tabler/icons-react";
import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProfile } from "../../Services/ProfileService";
import { setProfile } from "../../Slices/ProfileSlice";
import NotiMenu from "./NotiMenu";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../../Slices/UserSlice";
import { setupResponseInterceptor } from "../../Interceptor/AxiosInterceptor";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";
import { PUBLIC_NAVIGATION_LINKS, PROTECTED_NAVIGATION_LINKS } from "../../constants/navigation-links";

const Header = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const token = useSelector((state: any) => state.jwt);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setupResponseInterceptor(navigate, dispatch);
    }, [navigate, dispatch]);

    const handleClick = (url: string) => {
        navigate(url);
        close();
    };

    useEffect(() => {
        if (token) {
            if (localStorage.getItem("token")) {
                const decoded = jwtDecode(localStorage.getItem("token") || "");
                dispatch(setUser({ ...decoded, email: decoded.sub }));
            }
        }
        if (user?.profileId) {
            // dispatch(showOverlay());
            getProfile(user?.profileId)
                .then((res) => {
                    dispatch(setProfile(res));
                })
                .catch((err) => console.log(err));
            // .finally(() => dispatch(hideOverlay()));
        }
    }, [token, user?.profileId, dispatch]);

    return location.pathname !== "/signup" && location.pathname !== "/login" ? (
        <div
            data-aos="zoom-out"
            className="w-full bg-white px-6 text-deepSlate-900 h-20 flex justify-between items-center"
        >
            <div
                onClick={() => navigate("/")}
                className="flex gap-1 cursor-pointer items-center text-oceanTeal-500"
            >
                 <IconAnchor className="h-8 w-8" stroke={2.5} />
                 <div className="text-3xl font-semibold">HireWave</div>
            </div>
            <NavLinks /> {/* Render as a component, not a function call */}
            <div className="flex gap-3 items-center">
                {user ? (
                    <>
                        <NotiMenu />
                        <ProfileMenu />
                    </>
                ) : (
                    <Link to="/login" className="text-deepSlate-600 hover:text-oceanTeal-600">
                        <Button color="oceanTeal.4" variant="subtle">
                            Login
                        </Button>
                    </Link>
                )}
                <Burger
                    className="bs:hidden"
                    opened={opened}
                    onClick={open}
                    aria-label="Toggle navigation"
                />
                <Drawer
                    size="xs"
                    overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
                    position="right"
                    opened={opened}
                    onClose={close}
                    closeButtonProps={{
                        icon: <IconX size={30} />,
                    }}
                    className="bg-white"
                >
                    <div className="flex flex-col gap-6 items-center">
                        {/* Public links - visible to all users */}
                        {PUBLIC_NAVIGATION_LINKS.map((link) => (
                            <div key={link.url} className="h-full flex items-center">
                                <div
                                    className="hover:text-oceanTeal-600 text-xl text-deepSlate-900 cursor-pointer"
                                    onClick={() => handleClick(link.url)}
                                >
                                    {link.name}
                                </div>
                            </div>
                        ))}
                        {/* Protected links - visible only when authenticated */}
                        {user && PROTECTED_NAVIGATION_LINKS
                            .filter((link) => link.roles.includes(user.accountType))
                            .map((link) => (
                                <div key={link.url} className="h-full flex items-center">
                                    <div
                                        className="hover:text-oceanTeal-600 text-xl text-deepSlate-900 cursor-pointer"
                                        onClick={() => handleClick(link.url)}
                                    >
                                        {link.name}
                                    </div>
                                </div>
                            ))}
                    </div>
                </Drawer>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default Header;