
import { Button, LoadingOverlay, PasswordInput, Radio, TextInput } from "@mantine/core";
import { IconAt, IconLock, IconUser, IconAnchor } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../Services/UserService";
import { signupValidation } from "../../Services/FormValidation";
import { errorNotification, successNotification } from "../../Services/NotificationService";

const SignUp = () => {
    const form = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: "APPLICANT",
    };
    const [data, setData] = useState<{[key:string]:string}>(form);
    const [formError, setFormError] = useState<{[key:string]:string}>(form);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (event: any) => {
        if (typeof (event) == "string") {
            setData({ ...data, accountType: event });
            return;
        }
        let name = event.target.name, value = event.target.value;
        setData({ ...data, [name]: value });
        setFormError({ ...formError, [name]: signupValidation(name, value) });
        if (name === "password" && data.confirmPassword !== "") {
            let err = "";
            if (data.confirmPassword !== value) err = "Mật khẩu không trùng khớp.";
            setFormError({ ...formError, [name]: signupValidation(name, value), confirmPassword: err });
        }
        if (name === "confirmPassword") {
            if (data.password !== value) setFormError({ ...formError, [name]: "Mật khẩu không trùng khớp." });
            else setFormError({ ...formError, confirmPassword: "" });
        }
    };
    const handleSubmit = () => {
        setLoading(true);
        let valid = true, newFormError: { [key: string]: string } = {};
        for (let key in data) {
            if (key === "accountType") continue;
            if (key !== "confirmPassword") newFormError[key] = signupValidation(key, data[key]);
            else if (data[key] !== data["password"]) newFormError[key] = "Mật khẩu không trùng khớp.";
            if (newFormError[key]) valid = false;
        }
        setFormError(newFormError);
        if (valid === true) {
            registerUser(data).then((res) => {
                setData(form);
                successNotification("Đăng ký thành công", "Đang chuyển hướng đến trang đăng nhập...");
                
                  setTimeout(() => {
                    navigate("/login");
                    setLoading(false);
                  }, 3000);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
              errorNotification("Đăng ký thất bại", err.response?.data?.errorMessage || "Có lỗi xảy ra, vui lòng thử lại.");
        });

        }
    };

    return (
        <>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                className="translate-x-1/2"
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ color: "oceanTeal.4", type: "bars" }}
            />
            <div className="w-1/2 sm-mx:py-20 sm-mx:w-full px-20 bs-mx:px-10 md-mx:px-5 flex flex-col gap-4 justify-center bg-slate-50/60 rounded-3xl shadow-sm">
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
                            Tạo tài khoản
                        </h1>
                        <p className="text-sm text-slate-600">
                            Cùng HireWave khám phá cơ hội việc làm phù hợp với bạn.
                        </p>
                    </div>
                </div>

                <TextInput
                    value={data.name}
                    error={formError.name}
                    name="name"
                    onChange={handleChange}
                    leftSection={<IconUser size={16} />}
                    label="Họ và tên"
                    withAsterisk
                    placeholder="Nhập họ và tên của bạn"
                />
                <TextInput
                    error={formError.email}
                    value={data.email}
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
                    placeholder="Tạo mật khẩu"
                />

                <PasswordInput
                    value={data.confirmPassword}
                    error={formError.confirmPassword}
                    name="confirmPassword"
                    onChange={handleChange}
                    leftSection={<IconLock size={16} />}
                    label="Xác nhận mật khẩu"
                    withAsterisk
                    placeholder="Nhập lại mật khẩu"
                />

                <Radio.Group
                    value={data.accountType}
                    onChange={handleChange}
                    label="Bạn là"
                    withAsterisk
                >
                    <div className="flex gap-4 xs-mx:gap-3">
                        <Radio
                            name="accountType"
                            className="py-3 px-4 sm-mx:px-3 sm-mx:py-2 hover:bg-slate-100 border border-slate-300 rounded-lg has-[:checked]:!border-oceanTeal-400"
                            value="APPLICANT"
                            label="Ứng viên"
                        />
                        <Radio
                            name="accountType"
                            className="py-3 px-4 sm-mx:px-3 sm-mx:py-2 hover:bg-slate-100 border border-slate-300 rounded-lg has-[:checked]:!border-oceanTeal-400"
                            value="EMPLOYER"
                            label="Nhà tuyển dụng"
                        />
                    </div>
                </Radio.Group>

                <Button
                    loading={loading}
                    onClick={handleSubmit}
                    autoContrast
                    variant="filled"
                    className="mt-2 bg-oceanTeal-400 hover:bg-oceanTeal-500"
                >
                    Đăng ký
                </Button>

                <div className="text-center text-sm text-slate-700">
                    Đã có tài khoản?{" "}
                    <span
                        className="text-oceanTeal-500 hover:text-oceanTeal-600 hover:underline cursor-pointer font-medium"
                        onClick={() => {
                            navigate("/login");
                            setFormError(form);
                            setData(form);
                        }}
                    >
                        Đăng nhập
                    </span>
                </div>
            </div>
        </>
    );
};

export default SignUp;