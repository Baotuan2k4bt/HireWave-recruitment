import { Indicator, Menu, rem, Stack, Text, Group, Button, ScrollArea, Divider, Badge } from "@mantine/core";
import { IconBell, IconCheck, IconX, IconBellOff, IconClock, IconMessageCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNotifications, readNotification } from "../../Services/NotiService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const NotiMenu = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user);
    const [notifications, setNotifications] = useState<any>([]);
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            setLoading(true);
            getNotifications(user.id)
                .then((res) => {
                    setNotifications(res || []);
                })
                .catch((err) => console.log(err))
                .finally(() => setLoading(false));
        }
    }, [user?.id]);

    // Refresh notifications when menu opens
    useEffect(() => {
        if (opened && user?.id) {
            getNotifications(user.id)
                .then((res) => {
                    setNotifications(res || []);
                })
                .catch((err) => console.log(err));
        }
    }, [opened, user?.id]);

    const handleNotificationClick = (noti: any, index: number) => {
        if (noti.route) {
            navigate(noti.route);
            setOpened(false);
            markAsRead(noti.id, index);
        }
    };

    const markAsRead = (id: number, index: number) => {
        // Optimistic update
        const updatedNotifications = [...notifications];
        updatedNotifications[index] = { ...updatedNotifications[index], read: true };
        setNotifications(updatedNotifications);

        readNotification(id)
            .then((_res) => {
                // Remove from list after marking as read
                const filtered = notifications.filter((_: any, i: number) => i !== index);
                setNotifications(filtered);
            })
            .catch((err) => {
                console.log(err);
                // Revert on error
                setNotifications(notifications);
            });
    };

    const markAllAsRead = () => {
        const unreadNotifications = notifications.filter((noti: any) => !noti.read);
        unreadNotifications.forEach((noti: any, index: number) => {
            const originalIndex = notifications.findIndex((n: any) => n.id === noti.id);
            if (originalIndex !== -1) {
                markAsRead(noti.id, originalIndex);
            }
        });
    };

    const unreadCount = notifications.filter((noti: any) => !noti.read).length;

    const formatTime = (dateString: string) => {
        try {
            return dayjs(dateString).fromNow();
        } catch {
            return "Vừa xong";
        }
    };

    return (
        <Menu 
            shadow="xl" 
            width={420} 
            opened={opened} 
            onChange={setOpened}
            position="bottom-end"
            offset={8}
        >
            <Menu.Target>
                <button className="relative p-2 rounded-full hover:bg-deepSlate-100 transition-colors duration-200">
                    <Indicator
                        disabled={unreadCount <= 0}
                        color="red"
                        offset={4}
                        size={10}
                        processing={unreadCount > 0}
                        withBorder
                    >
                        <IconMessageCircle 
                            size={22} 
                            stroke={1.5} 
                            className="text-deepSlate-700"
                        />
                    </Indicator>
                </button>
            </Menu.Target>

            <Menu.Dropdown className="p-0">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 bg-white">
                    <Group justify="space-between" align="center">
                        <Text fw={600} size="lg" className="text-deepSlate-900">
                            Thông báo
                        </Text>
                        {unreadCount > 0 && (
                            <Group gap="xs">
                                <Badge color="red" variant="light" size="sm">
                                    {unreadCount} mới
                                </Badge>
                                <Button
                                    variant="subtle"
                                    size="xs"
                                    color="oceanTeal"
                                    onClick={markAllAsRead}
                                    className="text-xs"
                                >
                                    Đánh dấu đã đọc
                                </Button>
                            </Group>
                        )}
                    </Group>
                </div>

                {/* Notifications List */}
                <ScrollArea h={400} type="scroll">
                    {loading ? (
                        <div className="p-8 text-center">
                            <Text size="sm" c="dimmed">Đang tải...</Text>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <IconBellOff 
                                size={48} 
                                className="text-deepSlate-300 mx-auto mb-4" 
                            />
                            <Text size="sm" c="dimmed" fw={500}>
                                Chưa có thông báo
                            </Text>
                            <Text size="xs" c="dimmed" mt="xs">
                                Các thông báo mới sẽ xuất hiện ở đây
                            </Text>
                        </div>
                    ) : (
                        <Stack gap={0} className="divide-y divide-gray-100">
                            {notifications.map((noti: any, index: number) => {
                                const isUnread = !noti.read;
                                return (
                                    <div
                                        key={noti.id || index}
                                        onClick={() => handleNotificationClick(noti, index)}
                                        className={`
                                            px-4 py-3 cursor-pointer transition-colors duration-150
                                            ${isUnread ? 'bg-oceanTeal-50/50 hover:bg-oceanTeal-50' : 'hover:bg-deepSlate-50'}
                                            border-l-4 ${isUnread ? 'border-oceanTeal-500' : 'border-transparent'}
                                        `}
                                    >
                                        <Group gap="sm" align="flex-start" wrap="nowrap">
                                            {/* Icon */}
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                                                ${isUnread ? 'bg-oceanTeal-100' : 'bg-deepSlate-100'}
                                            `}>
                                                <IconCheck 
                                                    size={18} 
                                                    className={isUnread ? 'text-oceanTeal-600' : 'text-deepSlate-500'}
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <Group justify="space-between" gap="xs" mb={4}>
                                                    <Text 
                                                        fw={isUnread ? 600 : 500} 
                                                        size="sm" 
                                                        className="text-deepSlate-900 line-clamp-1"
                                                    >
                                                        {noti.action || 'Thông báo mới'}
                                                    </Text>
                                                    {isUnread && (
                                                        <div className="w-2 h-2 bg-oceanTeal-500 rounded-full flex-shrink-0" />
                                                    )}
                                                </Group>
                                                
                                                <Text 
                                                    size="xs" 
                                                    className="text-deepSlate-600 line-clamp-2 mb-2"
                                                >
                                                    {noti.message || 'Không có nội dung'}
                                                </Text>

                                                {noti.createdAt && (
                                                    <Group gap={4} align="center">
                                                        <IconClock size={12} className="text-deepSlate-400" />
                                                        <Text size="xs" c="dimmed">
                                                            {formatTime(noti.createdAt)}
                                                        </Text>
                                                    </Group>
                                                )}
                                            </div>

                                            {/* Close Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(noti.id, index);
                                                }}
                                                className="p-1 rounded hover:bg-deepSlate-200 transition-colors flex-shrink-0"
                                                aria-label="Đánh dấu đã đọc"
                                            >
                                                <IconX size={14} className="text-deepSlate-500" />
                                            </button>
                                        </Group>
                                    </div>
                                );
                            })}
                        </Stack>
                    )}
                </ScrollArea>

                {/* Footer */}
                {notifications.length > 0 && (
                    <>
                        <Divider />
                        <div className="px-4 py-3 bg-deepSlate-50">
                            <Button
                                variant="subtle"
                                size="sm"
                                fullWidth
                                color="oceanTeal"
                                onClick={() => {
                                    setOpened(false);
                                    navigate('/notifications');
                                }}
                            >
                                Xem tất cả thông báo
                            </Button>
                        </div>
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    );
};

export default NotiMenu;
