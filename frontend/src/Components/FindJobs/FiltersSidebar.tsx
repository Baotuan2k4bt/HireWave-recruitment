import { Button, Chip, ScrollArea } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import MultiInput from "./MultiInput";
import React, { useEffect, useState } from "react";
import { dropdownData } from "../../Data/JobsData";
import { useDispatch, useSelector } from "react-redux";
import { resetFilter, updateFilter } from "../../Slices/FilterSlice";

const FiltersSidebar = () => {
    const filter = useSelector((state: any) => state.filter);
    const dispatch = useDispatch();
    const [salarySelected, setSalarySelected] = useState<string[]>([]);
    
    useEffect(() => {
        setSalarySelected(filter.salary || []);
    }, [filter])

    const hasActiveFilters = Object.keys(filter).length > 0;

    return (
        <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Bộ lọc</h3>
                    {hasActiveFilters && (
                        <Button
                            onClick={() => dispatch(resetFilter())}
                            variant="subtle"
                            size="xs"
                            leftSection={<IconX size={14} />}
                            className="text-blue-600 hover:bg-blue-50"
                        >
                            Xóa tất cả
                        </Button>
                    )}
                </div>

                {/* Filters Content */}
                <ScrollArea h={600} className="px-4 py-4">
                    <div className="space-y-6">
                        {/* Filter Inputs */}
                        {dropdownData.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    {item.title}
                                </label>
                                <MultiInput title={item.title} icon={item.icon} options={item.options} />
                            </div>
                        ))}

                        {/* Mức lương - chọn nhiều như TopCV */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-gray-700">Mức lương</label>
                            </div>
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
                </ScrollArea>
            </div>
        </div>
    );
};

export default FiltersSidebar;
