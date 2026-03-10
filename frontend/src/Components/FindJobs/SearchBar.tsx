import { Button, Chip, Collapse } from "@mantine/core";
import { IconFilter, IconSearch, IconX } from "@tabler/icons-react";
import MultiInput from "./MultiInput";
import React, { useEffect, useState } from "react";
import { dropdownData } from "../../Data/JobsData";
import { useDispatch, useSelector } from "react-redux";
import { updateFilter } from "../../Slices/FilterSlice";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

const SearchBar = () => {
    const matches = useMediaQuery("(max-width: 768px)");
    const filter = useSelector((state: any) => state.filter);
    const [opened, { toggle }] = useDisclosure(false);
    const dispatch = useDispatch();
    const [salarySelected, setSalarySelected] = useState<string[]>([]);

    useEffect(() => {
        setSalarySelected(filter.salary || []);
    }, [filter]);

    const filterContent = (
        <div className="flex flex-wrap items-end gap-3 sm:gap-4 py-4">
            {/* Filter Inputs - style TopCV: label trên, dropdown dưới */}
            {dropdownData.map((item, index) => (
                <div
                    key={index}
                    className="flex-1 min-w-[140px] sm:min-w-[160px] lg:min-w-[180px]"
                >
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        {item.title}
                    </label>
                    <MultiInput
                        title={item.title}
                        icon={item.icon}
                        options={item.options}
                    />
                </div>
            ))}

            {/* Mức lương - chọn nhiều như TopCV */}
            <div className="flex-1 min-w-[140px] sm:min-w-[160px] lg:min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Mức lương (VNĐ)
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2">
                    <Chip.Group
                        multiple
                        value={salarySelected}
                        onChange={(val) => {
                            setSalarySelected(val);
                            dispatch(updateFilter({ salary: val }));
                        }}
                    >
                        <div className="flex flex-wrap gap-2">
                            <Chip value="under5" size="xs" className="data-[checked=true]:bg-[#00b14f] data-[checked=true]:text-white">
                                Dưới 5 triệu
                            </Chip>
                            <Chip value="5to10" size="xs" className="data-[checked=true]:bg-[#00b14f] data-[checked=true]:text-white">
                                5 - 10 triệu
                            </Chip>
                            <Chip value="10to20" size="xs" className="data-[checked=true]:bg-[#00b14f] data-[checked=true]:text-white">
                                10 - 20 triệu
                            </Chip>
                            <Chip value="20plus" size="xs" className="data-[checked=true]:bg-[#00b14f] data-[checked=true]:text-white">
                                Trên 20 triệu
                            </Chip>
                        </div>
                    </Chip.Group>
                </div>
            </div>

            {/* Nút Tìm kiếm - accent TopCV */}
            <div className="w-full sm:w-auto flex shrink-0">
                <Button
                    leftSection={<IconSearch size={18} stroke={2} />}
                    className="w-full sm:w-auto bg-[#00b14f] hover:bg-[#009643] text-white font-semibold shadow-sm hover:shadow transition-all duration-200"
                    size="md"
                >
                    Tìm kiếm
                </Button>
            </div>
        </div>
    );

    return (
        <div className="bg-white border-b border-gray-200 shadow-sm">
            {/* Mobile: nút mở/đóng bộ lọc */}
            {matches && (
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-700">
                        Bộ lọc tìm kiếm
                    </span>
                    <Button
                        onClick={toggle}
                        leftSection={
                            opened ? (
                                <IconX size={18} />
                            ) : (
                                <IconFilter size={18} />
                            )
                        }
                        variant="light"
                        size="sm"
                        className="font-semibold bg-emerald-50 text-[#00b14f] hover:bg-emerald-100 border border-emerald-100"
                    >
                        {opened ? "Đóng" : "Mở bộ lọc"}
                    </Button>
                </div>
            )}

            {/* Nội dung bộ lọc - luôn hiện trên desktop, collapse trên mobile */}
            <Collapse in={opened || !matches}>
                <div className="px-4 sm:px-6 lg:px-8">
                    {filterContent}
                </div>
            </Collapse>
        </div>
    );
};

export default SearchBar;
