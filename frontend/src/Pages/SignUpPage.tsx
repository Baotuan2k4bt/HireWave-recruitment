import { IconAnchor, IconArrowLeft } from "@tabler/icons-react";
import SignUp from "../Components/SignUpLogin/SignUp";
import Login from "../Components/SignUpLogin/Login";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, LoadingOverlay } from "@mantine/core";

const SignUpPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isSignUp = location.pathname === "/signup";

    return (
        <div
            data-aos="zoom-out"
            className="h-[100vh] w-[100vw] overflow-hidden sm-mx:overflow-y-auto relative bg-slate-50"
        >
            <Button
                size="sm"
                className="!absolute left-5 top-5 z-10 rounded-full shadow-sm"
                onClick={() => navigate("/")}
                color="oceanTeal.4"
                leftSection={<IconArrowLeft size={18} />}
                variant="light"
            >
                Trang chủ
            </Button>

            <div
                className={`flex [&>*]:flex-shrink-0 transition-all relative ease-in-out duration-1000 ${
                    isSignUp ? "-translate-x-1/2 sm-mx:-translate-x-full" : "translate-x-0"
                }`}
            >
                <Login />

                <div
                    className={`w-1/2 h-[100vh] sm-mx:hidden sm-mx:min-h-full transition-all duration-1000 flex items-center gap-6 justify-center flex-col ${
                        isSignUp ? "rounded-r-[200px]" : "rounded-l-[200px]"
                    } bg-gradient-to-br from-oceanTeal-50 via-sky-50 to-oceanTeal-100`}
                >
                    <div className="flex flex-col items-center gap-4 px-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-oceanTeal-300 to-oceanTeal-500 rounded-3xl blur-xl opacity-60" />
                                <div className="relative bg-gradient-to-br from-oceanTeal-500 to-oceanTeal-600 p-3.5 rounded-3xl shadow-lg shadow-oceanTeal-400/40 flex items-center justify-center">
                                    <IconAnchor className="h-8 w-8 text-white" stroke={2.4} />
                                </div>
                            </div>
                            <span className="text-5xl bs-mx:text-4xl md-mx:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-oceanTeal-600 via-teal-500 to-sky-500 bg-clip-text text-transparent drop-shadow-sm">
                                HireWave
                            </span>
                        </div>
                        <p className="text-xl bs-mx:text-lg md-mx:text-base font-medium text-oceanTeal-700/90 tracking-wide">
                            Tìm công việc dành riêng cho bạn
                        </p>
                        <p className="text-sm md-mx:text-xs text-slate-600 max-w-md text-center">
                            Nền tảng tuyển dụng hiện đại giúp bạn kết nối nhanh chóng với những cơ hội
                            phù hợp nhất, từ các nhà tuyển dụng uy tín.
                        </p>
                    </div>
                </div>

                <SignUp />
            </div>
        </div>
    );
};

export default SignUpPage;