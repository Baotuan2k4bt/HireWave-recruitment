import { Button, Divider } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Job from "../Components/JobDesc/Job";
import RecommendedJob from "../Components/JobDesc/RecommendedJob";
import { useEffect, useState } from "react";
import { getJob } from "../Services/JobService";
import { useDispatch } from "react-redux";
import { hideOverlay, showOverlay } from "../Slices/OverlaySlice";

const JobPage = () => {
    const {id}=useParams();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [job, setJob] = useState<any>(null);
    useEffect(()=>{
        window.scrollTo(0,0);
        dispatch(showOverlay());
        getJob(id).then((res)=>{
            setJob(res);
            if(res.jobStatus=="CLOSED")navigate(-1);
        }).catch((err)=>console.log(err))
        .finally(()=>dispatch(hideOverlay()));
    },[id])
    return (
        <div className="min-h-[90vh] bg-gray-50 py-6">
            <div className="w-full mx-auto px-4 lg:px-10">
                <Divider size="xs" />
                <Link className="my-5 inline-flex" to="/find-jobs">
                    <Button
                        color="oceanTeal.4"
                        leftSection={<IconArrowLeft size={20} />}
                        variant="light"
                        className="font-medium"
                    >
                        Quay lại danh sách việc làm
                    </Button>
                </Link>
                <div className="grid grid-cols-12 gap-6 items-start">
                    <div className="col-span-12 lg:col-span-8">
                        <Job {...job} />
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                        <RecommendedJob />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default JobPage;