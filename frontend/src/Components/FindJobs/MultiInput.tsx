import { useEffect, useState } from 'react';
import { Checkbox, Combobox, Group, Input, Pill, PillsInput, ScrollArea, useCombobox } from '@mantine/core';
import { IconSelector } from '@tabler/icons-react';
import { updateFilter } from '../../Slices/FilterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { current } from '@reduxjs/toolkit';

const MultiInput = (props:any) => {
    const dispatch=useDispatch();
    const filter=useSelector((state:any)=>state.filter);
    useEffect(()=>{
        setData(props.options);
        
    },[])
    useEffect(()=>{
        setValue(filter[props.title]??[])
    }, [filter])
    const combobox = useCombobox({
        onDropdownClose: () =>
            combobox.resetSelectedOption(),

        onDropdownOpen: () =>
            combobox.updateSelectedOptionIndex('active')

    });
    const [search, setSearch] = useState('');
    const [data, setData] = useState<string[]>([]);
    const [value, setValue] = useState<string[]>([]);
    const exactOptionMatch = data.some((item) => item === search);
    const handleValueSelect = (val: string) => {
        setSearch('');
        if (val === '$create') {
            setData((current) => [...current, search]);
            setValue((current) => [...current, search]);
            dispatch(updateFilter({[props.title]:[...value, search]}));
        } else {
            dispatch(updateFilter({[props.title]:value.includes(val) ? value.filter((v) => v !== val) : [...value, val]}));
            setValue((current) =>
                current.includes(val) ? current.filter((v) => v !== val) : [...current, val]);
            
        }
    }

    const handleValueRemove = (val: string) =>{
        dispatch(updateFilter({[props.title]:value.filter((v) => v !== val)}));
        setValue((current) => current.filter((v) => v !== val));
    }
    const values = value
        .slice(0,1)
        .map((item) => (
            <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
                {item.length>=10?item.substring(0, 8)+"..":item}
            </Pill>
        ));


    const options = data
        .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase())).map((item, index) => (
            <Combobox.Option value={item} key={item} active={value.includes(item)}
                className="animate-option-animation opacity-0" 
                style={{ animationDelay: `${index * 30}ms` }}
            >
                <Group gap="sm">
                    <Checkbox
                        size='xs'
                        checked={value.includes(item)}
                        onChange={() => {
                            if(value.includes(item))updateFilter({[props.title]:value.filter((v) => v !== item)});
                            else updateFilter({[props.title]:[...value, item]});
                         }}
                        aria-hidden
                        tabIndex={-1}
                        style={{ pointerEvents: 'none' }}
                        classNames={{
                            input: "border-blue-500 checked:bg-blue-500 checked:border-blue-500",
                        }}
                    />
                    <span className='text-gray-700 font-medium'>{item}</span>
                </Group>
            </Combobox.Option>
        ));

    return (
        <Combobox  store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
            <Combobox.DropdownTarget>
                <PillsInput 
                    variant='default' 
                    size="sm" 
                    pointer 
                    onClick={() => combobox.toggleDropdown()}
                    leftSection={
                        <div className="bg-blue-50 rounded-lg mr-2 text-blue-600 p-1.5 transition-colors duration-200 group-hover:bg-blue-100">
                            <props.icon size={18} stroke={2} /> 
                        </div>
                    }
                    rightSection={<IconSelector className="text-gray-400" size={18} />}
                    classNames={{
                        input: "bg-gray-50 border-gray-200 text-gray-900 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg",
                    }}
                >

                    <Pill.Group>
                        {value.length > 0 ? (
                            <>
                                {values}
                                {value.length > 1 && (
                                    <Pill >+{value.length - 1} more</Pill>
                                )}
                            </>
                        ) : (
                            <Input.Placeholder className='!text-gray-400'>{props.title}</Input.Placeholder>
                        )}

                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown className='border-2 border-gray-200 shadow-xl rounded-lg overflow-hidden'>
                <Combobox.Search 
                    className='w-full px-3 py-2 border-b border-gray-100'
                    classNames={{
                        input: "border-0 focus:ring-0 text-sm"
                    }}
                    variant="unstyled" 
                    placeholder="Tìm kiếm..."
                    value={search}
                    onChange={(event) => {
                        combobox.updateSelectedOptionIndex();
                        setSearch(event.currentTarget.value);
                    }}
                />
                <Combobox.Options className="p-1">
                    <ScrollArea.Autosize mah={200} type="scroll">
                        {options}

                        {!exactOptionMatch && search.trim().length > 0 && (
                            <Combobox.Option 
                                value="$create"
                                className="text-sm py-2 px-3 hover:bg-blue-50 transition-colors duration-150 cursor-pointer text-blue-600 font-medium"
                            >
                                + Tạo "{search}"
                            </Combobox.Option>
                        )}

                        {exactOptionMatch && search.trim().length > 0 && options.length === 0 && (
                            <Combobox.Empty className="text-gray-500 py-4">Không tìm thấy</Combobox.Empty>
                        )}
                    </ScrollArea.Autosize>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
export default MultiInput;