import { IconBriefcase,  IconMapPin } from "@tabler/icons-react";

const fields=[
    {label:"Chức danh",placeholder:"Nhập chức danh", options:['Designer', 'Developer', 'Product Manager', 'Marketing Specialist', 'Data Analyst', 'Sales Executive', 'Content Writer', 'Customer Support'], leftSection:IconBriefcase},
    {label:"Công ty",placeholder:"Nhập tên công ty", options:['Google', 'Microsoft', 'Meta', 'Netflix', 'Adobe', 'Facebook', 'Amazon', 'Apple', 'Spotify'], leftSection:IconBriefcase},
    {label:"Địa điểm",placeholder:"Nhập địa điểm làm việc", options:['Delhi', 'New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Toronto'], leftSection:IconMapPin}
]
export default fields;