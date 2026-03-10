import { useState } from 'react';
import { Combobox, useCombobox, ActionIcon } from '@mantine/core';
import { IconAdjustments, IconChevronDown } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { updateSort } from '../../Slices/SortSlice';

const opt = ['Relevance', 'Most Recent', 'Salary: Low to High', 'Salary: High to Low'];
const talentSort = ['Relevance', 'Experience: Low to High', 'Experience: High to Low'];

const Sort = (props: any) => {
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState<string | null>('Relevance');
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const options = props.sort == "job" 
        ? opt.map((item) => (
            <Combobox.Option 
                value={item} 
                key={item}
                className="text-sm py-2 px-3 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
            >
                {item}
            </Combobox.Option>
        ))
        : talentSort.map((item) => (
            <Combobox.Option 
                value={item} 
                key={item}
                className="text-sm py-2 px-3 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
            >
                {item}
            </Combobox.Option>
        ));

    return (
        <Combobox
            store={combobox}
            width={200}
            position="bottom-end"
            onOptionSubmit={(val) => {
                setSelectedItem(val);
                dispatch(updateSort(val));
                combobox.closeDropdown();
            }}
        >
            <Combobox.Target>
                <div
                    onClick={() => combobox.toggleDropdown()}
                    className="group flex items-center gap-2 cursor-pointer bg-white border-2 border-gray-200 rounded-lg px-4 py-2 hover:border-blue-400 hover:shadow-md transition-all duration-200"
                >
                    <IconAdjustments 
                        className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200" 
                        size={18} 
                        stroke={2} 
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200 flex-1">
                        {selectedItem}
                    </span>
                    <IconChevronDown 
                        className={`text-gray-400 group-hover:text-blue-600 transition-all duration-200 ${
                            combobox.dropdownOpened ? 'rotate-180' : ''
                        }`}
                        size={16} 
                        stroke={2} 
                    />
                </div>
            </Combobox.Target>

            <Combobox.Dropdown className="border-2 border-gray-200 shadow-xl rounded-lg overflow-hidden">
                <Combobox.Options className="p-1">
                    {options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}

export default Sort;