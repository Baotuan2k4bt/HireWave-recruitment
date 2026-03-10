// src/Pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { Badge, Select, Table, Tabs, Text, Button, Group, Pagination } from '@mantine/core';
import { IconBriefcase, IconUsers } from '@tabler/icons-react';
import {
    changeAccountStatus,
    getAllJobs,
    getAllUsersPaged,
    getPendingEmployers,
    getPendingJobs,
    approveEmployer,
    rejectEmployer,
    approveJob,
    rejectJob
} from '../Services/AdminService';
import { notifications } from '@mantine/notifications';

interface User {
    id: number;
    name: string;
    email: string;
    accountType: string;
    accountStatus: string;
}

interface Job {
    id: number;
    jobTitle: string;
    company: string;
    jobStatus: string;
    postTime: string;
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
    const [pendingEmployers, setPendingEmployers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>('users');
    const [usersPage, setUsersPage] = useState<number>(0);
    const [usersTotalPages, setUsersTotalPages] = useState<number>(1);
    const [usersTotalElements, setUsersTotalElements] = useState<number>(0);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsersPaged();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usersPage, activeTab]);

    const loadUsersPaged = async () => {
        try {
            const response = await getAllUsersPaged(usersPage, 20, 'id');
            setUsers(Array.isArray(response.content) ? response.content : []);
            setUsersTotalPages(response.totalPages || 1);
            setUsersTotalElements(response.totalElements || 0);
        } catch (error: any) {
            console.error('Error loading users:', error);
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to load users',
                color: 'red'
            });
            setUsers([]);
        }
    };

    const loadData = async () => {
        try {
            const [jobsData, pendingEmployersData, pendingJobsData] = await Promise.all([
                getAllJobs(),
                getPendingEmployers(),
                getPendingJobs()
            ]);

            // Ensure all data is properly initialized as arrays
            setJobs(Array.isArray(jobsData) ? jobsData : []);
            setPendingEmployers(Array.isArray(pendingEmployersData) ? pendingEmployersData : []);
            setPendingJobs(Array.isArray(pendingJobsData) ? pendingJobsData : []);
        } catch (error: any) {
            console.error('Error loading data:', error);
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to load data',
                color: 'red'
            });
            // Set empty arrays on error
            setJobs([]);
            setPendingEmployers([]);
            setPendingJobs([]);
        }
    };

    const handleStatusChange = async (userId: number, newStatus: string | null) => {
        if (!newStatus) return;
        try {
            await changeAccountStatus(userId, newStatus);
            loadUsersPaged();
            notifications.show({
                title: 'Success',
                message: 'Account status updated successfully',
                color: 'green'
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to update account status',
                color: 'red'
            });
        }
    };

    const handleApproveJob = async (jobId: number) => {
        try {
            await approveJob(jobId);
            loadData();
            notifications.show({
                title: 'Success',
                message: 'Job approved successfully',
                color: 'green'
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to approve job',
                color: 'red'
            });
        }
    };

    const handleRejectJob = async (jobId: number) => {
        try {
            await rejectJob(jobId);
            loadData();
            notifications.show({
                title: 'Success',
                message: 'Job rejected successfully',
                color: 'green'
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to reject job',
                color: 'red'
            });
        }
    };

    const handleApproveEmployer = async (userId: number) => {
        try {
            await approveEmployer(userId);
            loadData();
            notifications.show({
                title: 'Success',
                message: 'Employer approved successfully',
                color: 'green'
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to approve employer',
                color: 'red'
            });
        }
    };

    const handleRejectEmployer = async (userId: number) => {
        try {
            await rejectEmployer(userId);
            loadData();
            notifications.show({
                title: 'Success',
                message: 'Employer rejected successfully',
                color: 'green'
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to reject employer',
                color: 'red'
            });
        }
    };

    const handleTabChange = (value: string | null) => {
        if (value) setActiveTab(value);
    };

    return (
        <div className="min-h-[90vh] p-6">
            <Text size="xl" fw={700} mb="lg">Admin Dashboard</Text>

            <Tabs value={activeTab} onChange={handleTabChange}>
                <Tabs.List>
                    <Tabs.Tab value="users" leftSection={<IconUsers size={14}/>}>
                        Users Management
                    </Tabs.Tab>
                    <Tabs.Tab value="jobs" leftSection={<IconBriefcase size={14}/>}>
                        Jobs Management
                    </Tabs.Tab>
                    <Tabs.Tab value="pending-jobs" leftSection={<IconBriefcase size={14}/>}>
                        Pending Jobs
                    </Tabs.Tab>
                    <Tabs.Tab value="pending-employers" leftSection={<IconUsers size={14}/>}>
                        Pending Employers
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="users" pt="xl">
                    <Text size="sm" c="dimmed" mb="md">
                        Total users: {usersTotalElements} | Page {usersPage + 1} of {usersTotalPages}
                    </Text>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Role</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {users.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={6}>
                                        <Text color="dimmed" py="md" ta="center">
                                            No users found
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                users.map((user) => (
                                    <Table.Tr key={user.id}>
                                        <Table.Td>{user.id}</Table.Td>
                                        <Table.Td>{user.name}</Table.Td>
                                        <Table.Td>{user.email}</Table.Td>
                                        <Table.Td>
                                            <Badge color={user.accountType === 'ADMIN' ? 'red' : 'blue'}>
                                                {user.accountType}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={user.accountStatus === 'ACTIVE' ? 'green' : 'yellow'}>
                                                {user.accountStatus}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Select
                                                size="xs"
                                                value={user.accountStatus}
                                                onChange={(value) => handleStatusChange(user.id, value)}
                                                data={['ACTIVE', 'INACTIVE', 'BLOCKED']}
                                            />
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                    {usersTotalPages > 1 && (
                        <Group justify="center" mt="xl">
                            <Pagination
                                value={usersPage + 1}
                                onChange={(page) => setUsersPage(page - 1)}
                                total={usersTotalPages}
                            />
                        </Group>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="jobs" pt="xl">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Title</Table.Th>
                                <Table.Th>Company</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Posted Date</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {jobs.map((job) => (
                                <Table.Tr key={job.id}>
                                    <Table.Td>{job.id}</Table.Td>
                                    <Table.Td>{job.jobTitle}</Table.Td>
                                    <Table.Td>{job.company}</Table.Td>
                                    <Table.Td>
                                        <Badge color={job.jobStatus === 'ACTIVE' ? 'green' : 'gray'}>
                                            {job.jobStatus}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>{new Date(job.postTime).toLocaleDateString()}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>

                <Tabs.Panel value="pending-jobs" pt="xl">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Title</Table.Th>
                                <Table.Th>Company</Table.Th>
                                <Table.Th>Posted Date</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {!Array.isArray(pendingJobs) || pendingJobs.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={5}>
                                        <Text color="dimmed" py="md">
                                            No pending jobs found
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                pendingJobs.map((job) => (
                                    <Table.Tr key={job.id}>
                                        <Table.Td>{job.id}</Table.Td>
                                        <Table.Td>{job.jobTitle}</Table.Td>
                                        <Table.Td>{job.company}</Table.Td>
                                        <Table.Td>{new Date(job.postTime).toLocaleDateString()}</Table.Td>
                                        <Table.Td>
                                            <Group>
                                                <Button
                                                    size="xs"
                                                    color="green"
                                                    onClick={() => handleApproveJob(job.id)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    color="red"
                                                    onClick={() => handleRejectJob(job.id)}
                                                >
                                                    Reject
                                                </Button>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>

                <Tabs.Panel value="pending-employers" pt="xl">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {pendingEmployers.map((employer) => (
                                <Table.Tr key={employer.id}>
                                    <Table.Td>{employer.id}</Table.Td>
                                    <Table.Td>{employer.name}</Table.Td>
                                    <Table.Td>{employer.email}</Table.Td>
                                    <Table.Td>
                                        <Badge color="yellow">PENDING</Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group>
                                            <Button
                                                size="xs"
                                                color="green"
                                                onClick={() => handleApproveEmployer(employer.id)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="xs"
                                                color="red"
                                                onClick={() => handleRejectEmployer(employer.id)}
                                            >
                                                Reject
                                            </Button>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;