import { Badge, Tabs, Button } from "@mantine/core";
import Job from "../JobDesc/Job";
import TalentCard from "../FindTalent/TalentCard";
import { useEffect, useState } from "react";
import { deleteJob } from "../../Services/JobService";
import { getApplicantsByJob } from "../../Services/ApplicantService";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { IconTrash } from "@tabler/icons-react";

const PostedJobDesc = (props:any) => {
    const navigate = useNavigate();
    const [tab, setTab]=useState("overview");
    const [arr, setArr]=useState<any>([]);
    const [applicants, setApplicants]=useState<any>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (props.id) {
            getApplicantsByJob(props.id).then((res) => {
                setApplicants(res);
            }).catch((err) => console.log(err));
        }
    }, [props.id]);

    const handleTab=(value:any)=>{
        setTab(value);
        const data = applicants || [];
        if(value==="applicants")setArr(data.filter((x:any)=>x.applicationStatus==="APPLIED"));
        else if(value==="invited")setArr(data.filter((x:any)=>x.applicationStatus==="INTERVIEWING"));
        else if(value==="offered")setArr(data.filter((x:any)=>x.applicationStatus==="OFFERED"));
        else if(value==="rejected")setArr(data.filter((x:any)=>x.applicationStatus==="REJECTED"));
    }

    useEffect(()=>{
        handleTab(tab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [applicants, tab]);

    useEffect(()=>{
        setTab("overview");
    }, [props.id]);
    const handleDeleteJob = async () => {
        if (!props.id) return;
        if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            return;
        }
        setIsDeleting(true);
        try {
            await deleteJob(props.id);
            notifications.show({
                title: 'Success',
                message: 'Job deleted successfully',
                color: 'green'
            });
            navigate('/posted-jobs/0');
            window.location.reload();
        } catch (error: any) {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to delete job',
                color: 'red'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const applicantsData = applicants || [];
    const totalApplied = applicantsData.filter((x: any) => x.applicationStatus === "APPLIED").length;
    const totalInvited = applicantsData.filter((x: any) => x.applicationStatus === "INTERVIEWING").length;
    const totalOffered = applicantsData.filter((x: any) => x.applicationStatus === "OFFERED").length;
    const totalRejected = applicantsData.filter((x: any) => x.applicationStatus === "REJECTED").length;

    return <div data-aos="zoom-out" className="w-3/4 md-mx:w-full px-5 md-mx:p-0">
        {props.jobTitle ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md-mx:p-4">
                {/* Header: Job title + status + actions */}
                <div className="flex items-start justify-between gap-3 mb-3 xs-mx:flex-col xs-mx:items-stretch">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-2xl xs-mx:text-xl font-semibold text-deepSlate-900">
                                {props?.jobTitle}
                            </div>
                            <Badge
                                variant="light"
                                ml="sm"
                                color={props?.jobStatus === "ACTIVE" ? "oceanTeal.4" : props?.jobStatus === "CLOSED" ? "red.4" : "yellow.4"}
                                size="sm"
                                className="uppercase tracking-wide"
                            >
                                {props?.jobStatus}
                            </Badge>
                        </div>
                        <div className="font-medium xs-mx:text-sm text-deepSlate-300">
                            {props?.location || "Địa điểm đang cập nhật"}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 xs-mx:mt-2 xs-mx:justify-end">
                        <Button
                            leftSection={<IconTrash size={16} />}
                            color="red"
                            variant="light"
                            size="sm"
                            onClick={handleDeleteJob}
                            loading={isDeleting}
                        >
                            Xóa tin
                        </Button>
                    </div>
                </div>

                {/* Tabs: Overview & Applicants */}
                <Tabs value={tab} onChange={handleTab} radius="lg" autoContrast variant="outline">
                    <Tabs.List className="font-semibold mb-4 border-b border-gray-100 [&_button]:!text-sm [&_button]:px-3 [&_button]:py-2 [&_button[data-active='true']]:text-oceanTeal-500">
                        <Tabs.Tab value="overview">Tổng quan</Tabs.Tab>
                        <Tabs.Tab value="applicants">
                            Ứng tuyển
                            <span className="ml-1 text-xs text-deepSlate-400">
                                ({totalApplied})
                            </span>
                        </Tabs.Tab>
                        <Tabs.Tab value="invited">
                            Đã mời phỏng vấn
                            <span className="ml-1 text-xs text-deepSlate-400">
                                ({totalInvited})
                            </span>
                        </Tabs.Tab>
                        <Tabs.Tab value="offered">
                            Đã gửi offer
                            <span className="ml-1 text-xs text-deepSlate-400">
                                ({totalOffered})
                            </span>
                        </Tabs.Tab>
                        <Tabs.Tab value="rejected">
                            Từ chối
                            <span className="ml-1 text-xs text-deepSlate-400">
                                ({totalRejected})
                            </span>
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="overview" className="[&>div]:w-full mt-2">
                        {props.jobStatus === "CLOSED"
                            ? <Job {...props} edit={true} closed />
                            : <Job {...props} edit={true} />}
                    </Tabs.Panel>

                    <Tabs.Panel value="applicants" className="mt-4">
                        <div className="flex mt-4 flex-wrap gap-5 justify-around">
                            {arr?.length
                                ? arr.map((talent: any, index: any) =>
                                    <TalentCard key={index} {...talent} posted={true} />
                                )
                                : <div className="text-sm text-deepSlate-300 py-6 text-center w-full">
                                    Chưa có ứng viên ứng tuyển.
                                </div>
                            }
                        </div>
                    </Tabs.Panel>

                    <Tabs.Panel value="invited" className="mt-4">
                        <div className="flex mt-4 flex-wrap gap-5 justify-around">
                            {arr?.length
                                ? arr.map((talent: any, index: any) =>
                                    <TalentCard key={index} {...talent} invited />
                                )
                                : <div className="text-sm text-deepSlate-300 py-6 text-center w-full">
                                    Chưa có ứng viên được mời phỏng vấn.
                                </div>
                            }
                        </div>
                    </Tabs.Panel>

                    <Tabs.Panel value="offered" className="mt-4">
                        <div className="flex mt-4 flex-wrap gap-5 justify-around">
                            {arr?.length
                                ? arr.map((talent: any, index: any) =>
                                    <TalentCard key={index} {...talent} offered />
                                )
                                : <div className="text-sm text-deepSlate-300 py-6 text-center w-full">
                                    Chưa có ứng viên được gửi offer.
                                </div>
                            }
                        </div>
                    </Tabs.Panel>

                    <Tabs.Panel value="rejected" className="mt-4">
                        <div className="flex mt-4 flex-wrap gap-5 justify-around">
                            {arr?.length
                                ? arr.map((talent: any, index: any) =>
                                    <TalentCard key={index} {...talent} />
                                )
                                : <div className="text-sm text-deepSlate-300 py-6 text-center w-full">
                                    Chưa có ứng viên bị từ chối.
                                </div>
                            }
                        </div>
                    </Tabs.Panel>
                </Tabs>
            </div>
        ) : (
            <div className="text-2xl font-semibold flex items-center justify-center min-h-[70vh]">
                Job Not Found.
            </div>
        )}
    </div>
}
export default PostedJobDesc;