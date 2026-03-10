import { Menu, rem, Avatar, Switch } from '@mantine/core';
import {
    IconMessageCircle,
    IconLogout2,
    IconUserCircle,
    IconFileText,
    IconSun,
    IconMoonStars,
    IconMoon,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeUser } from '../../Slices/UserSlice';
import { removeJwt } from '../../Slices/JwtSlice';

const menuItems = {
    profile: {
        roles: ['APPLICANT', 'EMPLOYER', 'ADMIN'],
        icon: IconUserCircle,
        label: 'Profile',
        path: '/profile'
    },
    messages: {
        roles: ['APPLICANT', 'EMPLOYER', 'ADMIN'],
        icon: IconMessageCircle,
        label: 'Messages',
        path: '/messages'
    },
    resume: {
        roles: ['APPLICANT'],
        icon: IconFileText,
        label: 'Resume',
        path: '/resume'
    }
};
const ProfileMenu = () => {
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);
    const [opened, setOpened] = useState(false);
    const [checked, setChecked] = useState(false);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(removeUser());
        dispatch(removeJwt());
    };

    const renderMenuItem = (key: keyof typeof menuItems) => {
        const item = menuItems[key];
        if (!item.roles.includes(user.role)) return null;

        return (
            <Link to={item.path} key={key}>
                <Menu.Item
                    leftSection={
                        <item.icon
                            style={{ width: rem(14), height: rem(14) }}
                            color="var(--mantine-color-deepSlate-9)"
                        />
                    }
                >
                    {item.label}
                </Menu.Item>
            </Link>
        );
    };

    return (
        <Menu shadow="md" width={200} opened={opened} onChange={setOpened}>
            <Menu.Target>
                <div className="flex items-center gap-2 cursor-pointer bg-deepSlate-100 p-2 rounded-full">
                    <div className="xs-mx:hidden text-deepSlate-900">{user.name}</div>
                    <Avatar
                        src={profile.picture ? `data:image/jpeg;base64,${profile.picture}` : '/avatar.png'}
                        alt="it's me"
                    />
                </div>
            </Menu.Target>

            <Menu.Dropdown className="bg-white">
                {Object.keys(menuItems).map((key) => renderMenuItem(key as keyof typeof menuItems))}

                <Menu.Item
                    leftSection={
                        <IconMoon
                            style={{ width: rem(14), height: rem(14) }}
                            color="var(--mantine-color-deepSlate-9)"
                        />
                    }
                    rightSection={
                        <Switch
                            size="sm"
                            color="oceanTeal.4"
                            className="cursor-pointer"
                            onLabel={
                                <IconSun
                                    style={{ width: rem(14), height: rem(14) }}
                                    stroke={2.5}
                                    color="var(--mantine-color-oceanTeal-5)"
                                />
                            }
                            offLabel={
                                <IconMoonStars
                                    style={{ width: rem(14), height: rem(14) }}
                                    stroke={2.5}
                                    color="var(--mantine-color-oceanTeal-5)"
                                />
                            }
                            checked={checked}
                            onChange={(event) => setChecked(event.currentTarget.checked)}
                        />
                    }
                >
                    Dark Mode
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    onClick={handleLogout}
                    color="oceanTeal.5"
                    leftSection={
                        <IconLogout2
                            style={{ width: rem(14), height: rem(14) }}
                            color="var(--mantine-color-oceanTeal-5)"
                        />
                    }
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default ProfileMenu;