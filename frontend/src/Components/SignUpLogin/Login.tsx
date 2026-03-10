import { Button, LoadingOverlay, PasswordInput, TextInput } from "@mantine/core";
import { IconAt, IconLock, IconAnchor } from "@tabler/icons-react";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { loginValidation } from "../../Services/FormValidation";
import { useDisclosure } from "@mantine/hooks";
import ResetPassword from "./ResetPassword";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { useDispatch } from "react-redux";
import { setUser } from "../../Slices/UserSlice";
import { setJwt } from "../../Slices/JwtSlice";
import { loginUser } from "../../Services/AuthService";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const dispatch = useDispatch();
    const form = {
        email: "",
        password: "",
    };
    const [opened, { open, close }] = useDisclosure(false);
    const [data, setData] = useState<{ [key: string]: string }>(form);
    const [formError, setFormError] = useState<{ [key: string]: string }>(form);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event: any) => {
        setFormError({ ...formError, [event.target.name]: "" });
        setData({ ...data, [event.target.name]: event.target.value });
    };
    const handleSubmit = () => {
        let valid = true,
            newFormError: { [key: string]: string } = {};
        for (let key in data) {
            newFormError[key] = loginValidation(key, data[key]);
            if (newFormError[key]) valid = false;
        }
        setFormError(newFormError);
        if (valid) {
            setLoading(true);
            loginUser(data).then((res) => {
                successNotification("Đăng nhập thành công", "Đang chuyển hướng...");
                dispatch(setJwt(res.jwt));
                const decoded: any = jwtDecode(res.jwt);
                dispatch(setUser({ ...decoded, email: decoded.sub }));

                const accountType = decoded.accountType || localStorage.getItem("accountType") || "APPLICANT";
                let targetPath = "/";
                if (accountType === "EMPLOYER") {
                    // Nhà tuyển dụng: sang trang quản lý job & ứng viên theo từng job
                    targetPath = "/posted-jobs/0";
                } else if (accountType === "APPLICANT") {
                    // Ứng viên: sang trang tìm việc
                    targetPath = "/find-jobs";
                } else if (accountType === "ADMIN") {
                    targetPath = "/admin-dashboard";
                }

                setTimeout(() => {
                    navigate(targetPath);
                    setLoading(false);
                }, 1500);
            }).catch((err) => {
                console.log(err);
                    errorNotification("Đăng nhập thất bại", err.response?.data?.errorMessage || "Thông tin đăng nhập không hợp lệ.");
                    setLoading(false);
            });

        }
    };

    return (
        <>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ color: "oceanTeal.4", type: "bars" }}
            />
            <div
                data-aos="zoom-out"
                className="w-1/2 sm-mx:w-full px-20 bs-mx:px-10 md-mx:px-5 flex flex-col gap-4 justify-center bg-slate-50/60 rounded-3xl shadow-sm"
            >
                <div className="space-y-3 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-oceanTeal-200 to-oceanTeal-400 rounded-2xl blur-sm opacity-60" />
                            <div className="relative bg-gradient-to-br from-oceanTeal-400 to-oceanTeal-500 p-2.5 rounded-2xl flex items-center justify-center">
                                <IconAnchor className="h-6 w-6 text-white" stroke={2.2} />
                            </div>
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-slate-900">
                            HireWave
                        </span>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Đăng nhập
                        </h1>
                        <p className="text-sm text-slate-600">
                            Chào mừng bạn quay lại với HireWave. Hãy đăng nhập để tiếp tục.
                        </p>
                    </div>
                </div>

                <TextInput
                    value={data.email}
                    error={formError.email}
                    name="email"
                    onChange={handleChange}
                    leftSection={<IconAt size={16} />}
                    label="Email"
                    withAsterisk
                    placeholder="Nhập địa chỉ email"
                />
                <PasswordInput
                    value={data.password}
                    error={formError.password}
                    name="password"
                    onChange={handleChange}
                    leftSection={<IconLock size={16} />}
                    label="Mật khẩu"
                    withAsterisk
                    placeholder="Nhập mật khẩu"
                />

                <Button
                    loading={loading}
                    onClick={handleSubmit}
                    autoContrast
                    variant="filled"
                    className="mt-2 bg-oceanTeal-400 hover:bg-oceanTeal-500"
                >
                    Đăng nhập
                </Button>

                <div className="text-center text-sm text-slate-700">
                    Chưa có tài khoản?{" "}
                    <span
                        className="text-oceanTeal-500 hover:text-oceanTeal-600 hover:underline cursor-pointer font-medium"
                        onClick={() => {
                            navigate("/signup");
                            setFormError(form);
                            setData(form);
                        }}
                    >
                        Đăng ký
                    </span>
                </div>
                <div
                    className="text-oceanTeal-500 hover:text-oceanTeal-600 sm-mx:text-sm xs-mx:text-xs hover:underline cursor-pointer text-center"
                    onClick={open}
                >
                    Quên mật khẩu?
                </div>
            </div>
            <ResetPassword opened={opened} close={close} />
        </>
    );
};

export default Login;