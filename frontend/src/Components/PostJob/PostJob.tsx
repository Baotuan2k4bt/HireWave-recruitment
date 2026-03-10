
import { Button, NumberInput, TagsInput, Textarea } from "@mantine/core";
import { content, fields } from "../../Data/PostJob";
import SelectInput from "./SelectInput";
import TextEditor from "./TextEditor";
import { isNotEmpty, useForm } from "@mantine/form";
import { getJob, postJob } from "../../Services/JobService";
import { getMyCompany } from "../../Services/CompanyService";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";
import { Autocomplete } from "@mantine/core";

const PostJob = () => {
    const {id}=useParams();
    const user = useSelector((state: any) => state.user);
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const select = fields;
    const [editorData,setEditorData]=useState(content);
    const [companyData, setCompanyData] = useState<{id?: number, name: string} | null>(null);
    // const matches = useMediaQuery('(min-width: 350px)');

    // Fetch employer's company on mount
    useEffect(()=>{
        if (user?.id) {
            getMyCompany()
                .then((company) => {
                    if (company.id) {
                        setCompanyData({ id: company.id, name: company.name });
                        // Pre-fill company name in form
                        form.setFieldValue('company', company.name);
                    }
                })
                .catch((err) => {
                    // No company created yet - user needs to create one
                    console.log('No company found for user');
                });
        }
    }, [user?.id]);

    useEffect(()=>{
        window.scrollTo(0,0);
        if(Number(id)!=0){
            dispatch(showOverlay());
            getJob(id).then((res)=>{
                form.setValues(res);
                setEditorData(res.description);
            }).catch((err)=>console.log(err))
            .finally(()=>dispatch(hideOverlay()));
        }
        else{
            form.reset();
        }
    }, [id])
    const form = useForm({
        mode: 'controlled',
        validateInputOnChange: true,
        initialValues: {
            jobTitle: '',
            company: '',
            companyId: undefined as number | undefined,
            experience: '',
            jobType: '',
            location: '',
            packageOffered: '',
            skillsRequired: [],
            about: '',
            description: content,

        },
        validate: {
            jobTitle: isNotEmpty('Tiêu đề không được để trống'),
            location: isNotEmpty('Địa điểm làm việc không được để trống'),
            about: isNotEmpty('Giới thiệu công việc không được để trống'),
            description: isNotEmpty('Mô tả công việc không được để trống'),
            experience: isNotEmpty('Kinh nghiệm không được để trống'),
            jobType: isNotEmpty('Hình thức làm việc không được để trống'),
            packageOffered: isNotEmpty('Mức lương không được để trống'),
            skillsRequired: isNotEmpty('Kỹ năng không được để trống')

        }
    });
    const handlePost = () => {
        form.validate();
        if (!form.isValid()) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return;
        }
        if (!companyData) {
            errorNotification("Lỗi", "Bạn cần tạo thông tin công ty trước khi đăng tin");
            navigate('/employer/company');
            return;
        }
        const formValues = form.getValues();
        // Convert packageOffered to string if it's a number
        const jobData = {
            ...formValues,
            packageOffered: typeof formValues.packageOffered === 'number'
                ? `${formValues.packageOffered} USD`
                : String(formValues.packageOffered || ''),
            id,
            postedBy: user.id,
            companyId: companyData.id,
            jobStatus: "ACTIVE"
        };
        dispatch(showOverlay())
        postJob(jobData).then((res) => {
            successNotification("Thành công", "Đăng tin tuyển dụng thành công");
            navigate(`/posted-jobs/${res.id}`);
        }).catch((err) => {
            console.log(err);
            errorNotification("Lỗi", err.response.data.errorMessage);
        }).finally(()=>dispatch(hideOverlay()));
    }
    const handleDraft = () => {
        if (!companyData) {
            errorNotification("Lỗi", "Bạn cần tạo thông tin công ty trước khi đăng tin");
            navigate('/employer/company');
            return;
        }
        const formValues = form.getValues();
        // Convert packageOffered to string if it's a number
        const jobData = {
            ...formValues,
            packageOffered: typeof formValues.packageOffered === 'number'
                ? `${formValues.packageOffered} USD`
                : String(formValues.packageOffered || ''),
            id,
            postedBy: user.id,
            companyId: companyData.id,
            jobStatus: "DRAFT"
        };
        dispatch(showOverlay());
        postJob(jobData).then((res) => {
            successNotification("Thành công", "Lưu tin tuyển dụng ở trạng thái nháp");
            navigate(`/posted-jobs/${res.id}`);
        }).catch((err) => {
            console.log(err);
            errorNotification("Lỗi", err.response.data.errorMessage);
        }).finally(()=>dispatch(hideOverlay()));
    }
    return <div data-aos="zoom-out" className="px-16 bs-mx:px-10 md-mx:px-5 py-8 bg-slate-50 min-h-[calc(100vh-80px)]">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md-mx:p-6 sm-mx:p-4">
            <div className="mb-6">
                <div className="text-2xl font-semibold mb-1 text-slate-900">Đăng tin tuyển dụng</div>
                <div className="text-sm text-slate-500">
                    Điền đầy đủ thông tin bên dưới để tiếp cận nhiều ứng viên phù hợp hơn.
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="space-y-4">
                    <div className="text-sm font-semibold text-slate-700">Thông tin chung</div>
                    <div className="flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:!w-full sm-mx:flex-wrap">
<Autocomplete
  {...form.getInputProps("jobTitle")}
  label="Chức danh công việc"
  placeholder="Nhập chức danh công việc"
  data={select[0]?.options || []}
  limit={5}
/>

<Autocomplete
  {...form.getInputProps("company")}
  label="Tên công ty"
  placeholder="Nhập tên công ty"
  data={select[1]?.options || []}
  limit={5}
/>
</div>
                    <div className="flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:!w-full sm-mx:flex-wrap">
                      <Autocomplete
  {...form.getInputProps("experience")}
  label={select[2].label}
  placeholder={select[2].placeholder}
  data={select[2]?.options || []}
  limit={5}
 
/>
                        <SelectInput form={form} name="jobType" {...select[3]} />
                    </div>
                    <div className="flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:!w-full sm-mx:flex-wrap">
                        <SelectInput form={form} name="location" {...select[4]} />
                        <NumberInput
                            data-aos="zoom-out"
                            {...form.getInputProps("packageOffered")}
                            withAsterisk
                            label="Mức lương (USD)"
                            placeholder="Nhập mức lương dự kiến"
                            hideControls
                            min={1}
                            max={1000000}
                            clampBehavior="strict"
                        />
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                    <div className="text-sm font-semibold text-slate-700">Thông tin chi tiết</div>
                    <TagsInput
                        data-aos="zoom-out"
                        {...form.getInputProps("skillsRequired")}
                        withAsterisk
                        label="Kỹ năng yêu cầu"
                        placeholder="Nhập kỹ năng (Nhấn Enter để thêm)"
                        splitChars={[',', ' ', '|']}
                        clearable
                    />
                    <Textarea
                        data-aos="zoom-out"
                        {...form.getInputProps("about")}
                        withAsterisk
                        className="my-1"
                        label="Giới thiệu về công việc"
                        autosize
                        minRows={2}
                        placeholder="Mô tả ngắn gọn về vị trí, môi trường làm việc, phúc lợi..."
                    />
                    <div className="[&_button[data-active='true']]:!text-oceanTeal-400 [&_button[data-active='true']]:!bg-oceanTeal-400/20">
                        <div className="text-sm font-medium text-slate-700 mb-1">
                            Mô tả công việc<span className="text-red-600"> *</span>
                        </div>
                        <TextEditor data-aos="zoom-out" form={form} data={editorData} />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2 justify-end">
                    <Button
                        data-aos="zoom-out"
                        color="oceanTeal.4"
                        onClick={handleDraft}
                        variant="outline"
                    >
                        Lưu bản nháp
                    </Button>
                    <Button
                        data-aos="zoom-out"
                        color="oceanTeal.4"
                        onClick={handlePost}
                        variant="light"
                    >
                        Đăng tin
                    </Button>
                </div>
            </div>
        </div>
    </div>
}
export default PostJob;