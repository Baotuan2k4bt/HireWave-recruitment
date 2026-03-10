import {Button, Divider, Drawer } from "@mantine/core";
import PostedJob from "../Components/PostedJob/PostedJob";
import PostedJobDesc from "../Components/PostedJob/PostedJobDesc";
import { useEffect, useState } from "react";
import { getJobsPostedBy, getJob } from "../Services/JobService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { hideOverlay, showOverlay } from "../Slices/OverlaySlice";

const PostedJobPage = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {id}=useParams();
    const user=useSelector((state:any)=>state.user);
    const [opened, { open, close }] = useDisclosure(false);
    const [jobList, setJobList] = useState<any>([]);
    const [job, setJob] = useState<any>(null);
    const matches = useMediaQuery('(max-width: 767px)');

    useEffect(()=>{
        if (!user?.id) return;

        window.scrollTo(0,0);
        dispatch(showOverlay());

        // Fetch the summary list of jobs for the sidebar
        getJobsPostedBy(user.id).then((res)=>{
            setJobList(res);
            if(res && res.length>0 && (id === "0" || !id)){
                const firstActive = res.find((x:any)=>x.jobStatus=="ACTIVE") || res[0];
                navigate(`/posted-jobs/${firstActive.id}`);
            }
        }).catch((err)=>console.log(err));

        // Fetch full details (including applicants) for the selected job
        if(id && id !== "0") {
            getJob(id).then((res)=>{
                setJob(res);
            }).catch((err)=>console.log(err))
            .finally(()=>dispatch(hideOverlay()));
        } else {
            dispatch(hideOverlay());
        }
    }, [id, user?.id])
    return (
        <div className="min-h-[90vh] bg-white px-5">
            <Divider />
            {matches&&<Button my="xs" size="sm" autoContrast onClick={open}>All Jobs</Button>}
            <Drawer opened={opened} size={230} overlayProps={{ backgroundOpacity: 0.5, blur: 4 }} onClose={close} title="All Jobs">
                <PostedJob job={job} jobList={jobList}/>   
            </Drawer>
            <div className="flex gap-5 justify-around py-5">
                {!matches&&<PostedJob job={job} jobList={jobList}/>          }              
                <PostedJobDesc {...job} />
            </div>
        </div>
    )
}
export default PostedJobPage;