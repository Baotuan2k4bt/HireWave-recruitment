
import Sort from "./Sort";
import JobCard from "./JobCard";
import { useEffect, useState } from "react";
import { getAllJobs, getAllJobsPaged } from "../../Services/JobService";
import { useDispatch, useSelector } from "react-redux";
import { resetFilter } from "../../Slices/FilterSlice";
import { resetSort } from "../../Slices/SortSlice";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";
import { Button, Pagination, Text, Group } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { parseSalaryToNumber, parseMinSalary, parseMaxSalary } from "../../Utils/salaryUtils";

const SALARY_OPTIONS = [
    { id: "under5", min: 0, max: 5000000 },
    { id: "5to10", min: 5000000, max: 10000000 },
    { id: "10to20", min: 10000000, max: 20000000 },
    { id: "20plus", min: 20000000, max: Infinity },
];

const Jobs = () => {
    const dispatch=useDispatch();
    const [jobList, setJobList] = useState<any[]>([]);
    const filter=useSelector((state:any)=>state.filter);
    const sort=useSelector((state:any)=>state.sort);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [usePagination, setUsePagination] = useState(true);
    
    useEffect(()=>{
        dispatch(resetSort());
        loadJobs();
        return ()=>{
            if(!filter.page)dispatch(resetFilter());
          }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])
    
    const loadJobs = async () => {
        dispatch(showOverlay());
        try {
            if (usePagination) {
                const response = await getAllJobsPaged(currentPage, 20, 'id');
                const activeJobs = response.content.filter((job:any)=>job.jobStatus==="ACTIVE");
                setJobList(activeJobs);
                setTotalPages(response.totalPages || 1);
                setTotalElements(response.totalElements || 0);
            } else {
                const res = await getAllJobs();
                const activeJobs = res.filter((job:any)=>job.jobStatus==="ACTIVE");
                setJobList(activeJobs);
            }
        } catch (err) {
            console.log(err);
            setUsePagination(false);
            getAllJobs().then((res)=>{
                const activeJobs = res.filter((job:any)=>job.jobStatus==="ACTIVE");
                setJobList(activeJobs);
            }).catch((error)=>console.log(error));
        } finally {
            dispatch(hideOverlay());
        }
    };
    useEffect(()=>{
        if(sort==="Most Recent"){
            setJobList((prevList) => [...prevList].sort((a: any, b: any) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime()));
        }
        else if(sort==="Salary: Low to High"){
            setJobList((prevList) => [...prevList].sort((a: any, b: any) => {
                const salaryA = parseSalaryToNumber(a.packageOffered);
                const salaryB = parseSalaryToNumber(b.packageOffered);
                return salaryA - salaryB;
            }));
        }
        else if(sort==="Salary: High to Low"){
            setJobList((prevList) => [...prevList].sort((a: any, b: any) => {
                const salaryA = parseSalaryToNumber(a.packageOffered);
                const salaryB = parseSalaryToNumber(b.packageOffered);
                return salaryB - salaryA;
            }));
        }

    }, [sort])
    useEffect(()=>{
        let filtered = jobList;
        if(filter["Chức danh"] && filter["Chức danh"].length>0)filtered=filtered.filter((job:any)=>filter["Chức danh"]?.some((x:any)=>job.jobTitle?.toLowerCase().includes(x.toLowerCase())));
        if(filter["Địa điểm"] && filter["Địa điểm"].length>0)filtered=filtered.filter((job:any)=>filter["Địa điểm"]?.some((x:any)=>job.location?.toLowerCase().includes(x.toLowerCase())));
        if(filter["Kinh nghiệm"] && filter["Kinh nghiệm"].length>0)filtered=filtered.filter((job:any)=>filter["Kinh nghiệm"]?.some((x:any)=>job.experience?.toLowerCase().includes(x.toLowerCase())));
        if(filter["Hình thức"] && filter["Hình thức"].length>0)filtered=filtered.filter((job:any)=>filter["Hình thức"]?.some((x:any)=>job.jobType?.toLowerCase().includes(x.toLowerCase())));
        if(filter.salary && filter.salary.length>0){
            const selectedRanges: string[] = filter.salary;
            filtered=filtered.filter((job:any)=>{
                const jobMinSalary = parseMinSalary(job.packageOffered);
                const jobMaxSalary = parseMaxSalary(job.packageOffered);
                return SALARY_OPTIONS.some((opt) => 
                    selectedRanges.includes(opt.id) &&
                    jobMinSalary <= opt.max &&
                    jobMaxSalary >= opt.min
                );
            });
        }
        setFilteredJobs(filtered);
    },[filter,jobList])
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Việc làm đề xuất
                    </h2>
                    {usePagination && (
                        <Text size="sm" c="dimmed" className="font-normal">
                            ({totalElements} việc làm)
                        </Text>
                    )}
                </div>
                <Sort sort="job" />
            </div>

            {/* Jobs Grid */}
            {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredJobs.map((job: any, index: any) => (
                        <JobCard key={index} {...job} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg font-medium mb-2">
                        Không tìm thấy việc làm
                    </div>
                    <p className="text-sm text-gray-400">
                        Thử điều chỉnh bộ lọc để xem thêm kết quả
                    </p>
                </div>
            )}

            {/* Pagination */}
            {usePagination && totalPages > 1 && (
                <Group justify="center" mt="xl" pt="xl" className="border-t border-gray-200">
                    <Pagination
                        value={currentPage + 1}
                        onChange={(page) => setCurrentPage(page - 1)}
                        total={totalPages}
                        classNames={{
                            control: "border-gray-300 hover:bg-blue-50 hover:border-blue-400",
                            dots: "text-gray-400",
                        }}
                    />
                </Group>
            )}
        </div>
    );
}
export default Jobs;