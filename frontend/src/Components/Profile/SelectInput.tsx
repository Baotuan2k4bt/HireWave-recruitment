import { useEffect, useState } from 'react';
import { Combobox, InputBase, ScrollArea, TextInput, useCombobox } from '@mantine/core';


const SelectInput = (props:any) => {
    useEffect(()=>{
        setData(props.options || []);
        const currentValue = props.form.getInputProps(props.name).value;
        setValue(currentValue);
        setSearch(currentValue);
    }, [props.options, props.form, props.name])
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [data, setData] = useState<string[]>(props.options || []);
  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const exactOptionMatch = data.some((item) => item === search);
  const filteredOptions = exactOptionMatch
    ? data
    : data.filter((item) => item.toLowerCase().includes(search?.toLowerCase().trim()));

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === '$create') {
          setData((current) => [...current, search]);
          setValue(search);
          props.form.setFieldValue(props.name,search);
        } else {
          setValue(val);
          setSearch(val);
          props.form.setFieldValue(props.name,val);
        }
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          data-aos="zoom-out"
          label={props.label}
          withAsterisk
          rightSection={<Combobox.Chevron />}
          leftSection={props.leftSection ? <props.leftSection className="" stroke={1.5}/> : null}
          {...props.form.getInputProps(props.name)}
          value={search}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(value || '');
          }}
          placeholder={props.placeholder}
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
        <ScrollArea.Autosize mah={200} type="scroll">
          {options}
          {!exactOptionMatch && search?.trim().length > 0 && (
            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
          )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
export default SelectInput;