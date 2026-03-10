import { Container, Title, Text, Paper, Button, Stack } from "@mantine/core";
import { IconFileText, IconDownload, IconEdit } from "@tabler/icons-react";
import { ROUTE_PATHS } from "../constants/route-paths";

const CreateCVPage = () => {
    return (
        <div className="min-h-[90vh] bg-white py-12">
            <Container size="lg">
                <Stack gap="xl">
                    <div className="text-center">
                        <Title order={1} size="3rem" className="text-deepSlate-900 mb-4">
                            Tạo CV Chuyên Nghiệp
                        </Title>
                        <Text size="lg" className="text-deepSlate-600">
                            Tạo CV ấn tượng để thu hút nhà tuyển dụng
                        </Text>
                    </div>

                    <Paper shadow="sm" p="xl" radius="md" className="bg-white">
                        <Stack gap="md">
                            <div className="flex items-center gap-3 mb-4">
                                <IconFileText size={32} className="text-oceanTeal-500" />
                                <Title order={2} className="text-deepSlate-900">
                                    Hướng dẫn tạo CV
                                </Title>
                            </div>
                            
                            <div className="space-y-4 text-deepSlate-700">
                                <div>
                                    <Text fw={600} size="lg" className="mb-2">
                                        1. Thông tin cá nhân
                                    </Text>
                                    <Text>
                                        Điền đầy đủ thông tin cá nhân: Họ tên, Email, Số điện thoại, Địa chỉ
                                    </Text>
                                </div>

                                <div>
                                    <Text fw={600} size="lg" className="mb-2">
                                        2. Kinh nghiệm làm việc
                                    </Text>
                                    <Text>
                                        Liệt kê các công việc đã làm, bao gồm: Tên công ty, Vị trí, Thời gian, Mô tả công việc
                                    </Text>
                                </div>

                                <div>
                                    <Text fw={600} size="lg" className="mb-2">
                                        3. Học vấn
                                    </Text>
                                    <Text>
                                        Ghi rõ trình độ học vấn: Trường học, Chuyên ngành, Thời gian tốt nghiệp
                                    </Text>
                                </div>

                                <div>
                                    <Text fw={600} size="lg" className="mb-2">
                                        4. Kỹ năng
                                    </Text>
                                    <Text>
                                        Liệt kê các kỹ năng chuyên môn và kỹ năng mềm liên quan đến công việc
                                    </Text>
                                </div>

                                <div>
                                    <Text fw={600} size="lg" className="mb-2">
                                        5. Chứng chỉ & Giải thưởng
                                    </Text>
                                    <Text>
                                        Thêm các chứng chỉ, giải thưởng hoặc thành tích nổi bật
                                    </Text>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <Button
                                    leftSection={<IconEdit size={18} />}
                                    color="oceanTeal.4"
                                    size="lg"
                                    onClick={() => {
                                        // Redirect to profile page if logged in, else to login
                                        const token = localStorage.getItem('token');
                                        if (token) {
                                            window.location.href = ROUTE_PATHS.PROFILE;
                                        } else {
                                            window.location.href = ROUTE_PATHS.LOGIN;
                                        }
                                    }}
                                >
                                    Tạo CV ngay
                                </Button>
                                <Button
                                    leftSection={<IconDownload size={18} />}
                                    variant="outline"
                                    color="oceanTeal.4"
                                    size="lg"
                                >
                                    Tải mẫu CV
                                </Button>
                            </div>
                        </Stack>
                    </Paper>

                    <Paper shadow="sm" p="xl" radius="md" className="bg-deepSlate-50">
                        <Title order={3} className="text-deepSlate-900 mb-4">
                            Mẹo tạo CV hiệu quả
                        </Title>
                        <ul className="list-disc list-inside space-y-2 text-deepSlate-700">
                            <li>Sử dụng font chữ dễ đọc và định dạng nhất quán</li>
                            <li>Giữ CV ngắn gọn, tập trung vào thông tin quan trọng nhất</li>
                            <li>Tùy chỉnh CV cho từng vị trí ứng tuyển</li>
                            <li>Sử dụng từ khóa liên quan đến công việc</li>
                            <li>Kiểm tra chính tả và ngữ pháp cẩn thận</li>
                            <li>Thêm số liệu cụ thể để thể hiện thành tích</li>
                        </ul>
                    </Paper>
                </Stack>
            </Container>
        </div>
    );
};

export default CreateCVPage;

