import { useEffect, useState } from "react";
import Sort from "../FindJobs/Sort";
import TalentCard from "./TalentCard";
import { getAllProfiles, getAllProfilesPaged } from "../../Services/ProfileService";
import { useDispatch, useSelector } from "react-redux";
import { resetFilter } from "../../Slices/FilterSlice";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";
import { Pagination, Text, Group } from "@mantine/core";

const Talents=()=>{
    const dispatch=useDispatch();
    const [talents, setTalents] = useState<any[]>([]);
    const filter=useSelector((state:any)=>state.filter);
    const sort=useSelector((state:any)=>state.sort);
    const [filteredTalents, setFilteredTalents] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [usePagination, setUsePagination] = useState(true);
    
    useEffect(() => {
        dispatch(resetFilter());
        loadTalents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])
    
    const loadTalents = async () => {
        dispatch(showOverlay());
        try {
            if (usePagination) {
                const response = await getAllProfilesPaged(currentPage, 20, 'id');
                setTalents(response.content);
                setTotalPages(response.totalPages || 1);
                setTotalElements(response.totalElements || 0);
            } else {
                const res = await getAllProfiles();
                setTalents(res);
            }
        } catch (err) {
            console.log(err);
            setUsePagination(false);
            getAllProfiles().then((res) => {
                setTalents(res);
            }).catch((error) => console.log(error));
        } finally {
            dispatch(hideOverlay());
        }
    };
    useEffect(()=>{
        if(sort==="Experience: Low to High"){
            setTalents((prevTalents) => [...prevTalents].sort((a: any, b: any) => a.totalExp - b.totalExp));
        }
        else if(sort==="Experience: High to Low"){
            setTalents((prevTalents) => [...prevTalents].sort((a: any, b: any) => b.totalExp - a.totalExp));
        }

    }, [sort])
    useEffect(()=>{
        let filtered = talents;

        if(filter.name)filtered=filtered.filter((talent:any)=>talent.name.toLowerCase().includes(filter.name.toLowerCase()));
        if(filter["Chức danh"] && filter["Chức danh"].length>0)filtered=filtered.filter((talent:any)=>filter["Chức danh"]?.some((x:any)=>talent.jobTitle?.toLowerCase().includes(x.toLowerCase())));
        if(filter["Địa điểm"] && filter["Địa điểm"].length>0)filtered=filtered.filter((talent:any)=>filter["Địa điểm"]?.some((x:any)=>talent.location?.toLowerCase().includes(x.toLowerCase())));
        if(filter["Kỹ năng"] && filter["Kỹ năng"].length>0)filtered=filtered.filter((talent:any)=>filter["Kỹ năng"]?.some((x:any)=>talent.skills?.some((y:any)=>y.toLowerCase().includes(x.toLowerCase()))));
          if(filter.exp && filter.exp.length>0)filtered=filtered.filter((talent:any)=>filter.exp[0]<=talent.totalExp && talent.totalExp<=filter.exp[1]);
        setFilteredTalents(filtered);
    },[filter,talents])
    return <div className="px-5 py-5">
    <div className="flex justify-between mt-5">
        <div className="text-2xl font-semibold flex items-center gap-3">
            Ứng tuyển
            {usePagination && (
                <Text size="sm" c="dimmed" className="font-normal">
                    ({totalElements} ứng viên)
                </Text>
            )}
        </div>
        <Sort />
    </div>
    <div className="flex mt-10 flex-col gap-4">
        {
            filteredTalents.length > 0 ? (
                filteredTalents.map((talent:any, index:any) => <TalentCard key={index} {...talent}  />)
            ) : (
                <div className="font-medium text-lg w-full text-center py-10">
                    Không có ứng viên nào
                </div>
            )
        }
    </div>
    {usePagination && totalPages > 1 && (
        <Group justify="center" mt="xl">
            <Pagination
                value={currentPage + 1}
                onChange={(page) => setCurrentPage(page - 1)}
                total={totalPages}
            />
        </Group>
    )}
</div>
}
export default Talents;