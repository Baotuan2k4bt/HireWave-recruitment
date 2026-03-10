import { Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import PostedJobCard from "./PostedJobCard";

const PostedJob = (props:any) => {

    const [activeTab, setActiveTab] = useState<string | null>(props.job?.jobStatus|| "ACTIVE");
    useEffect(()=>{
        setActiveTab(props.job?.jobStatus|| "ACTIVE");
    },[props.job])
    return <div className="w-1/5">
        <div className="text-2xl font-semibold mb-5">Jobs</div>
        <div>
            <Tabs variant="pills" autoContrast value={activeTab} onChange={setActiveTab}>
                <Tabs.List className="[&_button[aria-selected='false']]:bg-deepSlate-100 font-medium">
                    <Tabs.Tab value="PENDING">Đang chờ[{props.jobList.filter((job:any)=>job?.jobStatus=="PENDING").length}]</Tabs.Tab>
                    <Tabs.Tab value="ACTIVE">Hoạt động[{props.jobList.filter((job:any)=>job?.jobStatus=="ACTIVE").length}]</Tabs.Tab>
                    <Tabs.Tab value="DRAFT">Bản nháp[{props.jobList.filter((job:any)=>job?.jobStatus=="DRAFT").length}]</Tabs.Tab>
                    <Tabs.Tab value="CLOSED">Đóng  [{props.jobList.filter((job:any)=>job?.jobStatus=="CLOSED").length}]</Tabs.Tab>
                </Tabs.List>
            </Tabs>
        </div>
        <div className="flex flex-col flex-wrap mt-5 gap-5">
            {
              props.jobList.filter((job:any)=>job?.jobStatus==activeTab) .sort((a: any, b: any) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime()).map((item:any, index:any)=> <PostedJobCard key={index} {...item}/>) 
              
            }
        </div>
    </div>

}
export default PostedJob;