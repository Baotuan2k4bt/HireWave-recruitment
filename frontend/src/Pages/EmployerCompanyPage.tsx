import { useState, useEffect } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Container,
  Title,
  Paper,
  SimpleGrid,
  Group,
  Alert,
  Anchor,
  Image,
  Divider,
  FileInput
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import {
  IconBuilding,
  IconAlertCircle,
  IconCheck,
  IconUpload,
  IconWorld,
  IconMapPin,
  IconUsers
} from "@tabler/icons-react";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  getMyCompany,
  createCompany,
  updateCompany,
  CompanyDTO
} from "../Services/CompanyService";

import { showOverlay, hideOverlay } from "../Slices/OverlaySlice";

const EmployerCompanyPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const [company, setCompany] = useState<CompanyDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!company;

  const form = useForm({
    initialValues: {
      name: "",
      logoUrl: "",
      website: "",
      location: "",
      industry: "",
      companySize: "",
      description: ""
    },
    validate: {
      name: (value) => (!value ? "Tên công ty là bắt buộc" : null)
    }
  });

  /* ---------------- LOAD COMPANY ---------------- */

  useEffect(() => {

    if (!user?.id) {
      setError("Người dùng chưa đăng nhập");
      return;
    }

    dispatch(showOverlay());

    getMyCompany()
      .then((data) => {

        setCompany(data);

        form.setValues({
          name: data.name || "",
          logoUrl: data.logoUrl || "",
          website: data.website || "",
          location: data.location || "",
          industry: data.industry || "",
          companySize: data.companySize || "",
          description: data.description || ""
        });

        if (data.logoUrl) {
          setLogoPreview(data.logoUrl);
        }

      })
      .catch((err: any) => {

        if (err.response?.status !== 404) {

          setError("Không thể tải thông tin công ty");

          notifications.show({
            title: "Lỗi",
            message: "Không thể tải thông tin công ty",
            color: "red",
            icon: <IconAlertCircle />
          });

        }

      })
      .finally(() => dispatch(hideOverlay()));

  }, [user?.id]);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (values: typeof form.values) => {

    setLoading(true);
    setError(null);

    try {

      dispatch(showOverlay());

      const companyData: CompanyDTO = {
        ...values,
        ownerId: user.id
      };

      if (isEdit && company) {

        await updateCompany(company.id!, companyData);

        notifications.show({
          title: "Thành công",
          message: "Cập nhật công ty thành công",
          color: "green",
          icon: <IconCheck />
        });

      } else {

        await createCompany(companyData);

        notifications.show({
          title: "Thành công",
          message: "Tạo công ty thành công",
          color: "green",
          icon: <IconCheck />
        });

      }

    } catch (err: any) {

      const message = err.response?.data?.message || "Lỗi khi lưu công ty";

      setError(message);

      notifications.show({
        title: "Lỗi",
        message,
        color: "red",
        icon: <IconAlertCircle />
      });

    } finally {

      setLoading(false);
      dispatch(hideOverlay());

    }

  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-[90vh] bg-gray-50 py-10">

      <Container size="md">

        <Paper shadow="sm" p="xl" radius="md" withBorder>

          <Group justify="space-between" mb="xl">

            <Title order={2} className="flex items-center gap-2">
              <IconBuilding size={24} />
              {isEdit ? "Chỉnh sửa công ty" : "Tạo công ty"}
            </Title>

            {isEdit && (
              <Anchor onClick={() => navigate(0)} size="sm">
                Tạo công ty mới
              </Anchor>
            )}

          </Group>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">

              <TextInput
                required
                label="Tên công ty"
                placeholder="Nhập tên công ty"
                leftSection={<IconBuilding size={16} />}
                {...form.getInputProps("name")}
              />

              <FileInput
                label="Logo công ty"
                placeholder="Chọn logo"
                accept="image/png,image/jpeg"
                leftSection={<IconUpload size={16} />}
                onChange={(file) => {

                  if (file) {

                    const preview = URL.createObjectURL(file);

                    setLogoPreview(preview);

                    // Trong production nên upload lên server
                    form.setFieldValue("logoUrl", preview);

                  }

                }}
              />

              <TextInput
                label="Website"
                placeholder="https://company.com"
                leftSection={<IconWorld size={16} />}
                {...form.getInputProps("website")}
              />

              <TextInput
                label="Địa điểm"
                placeholder="Thành phố, quốc gia"
                leftSection={<IconMapPin size={16} />}
                {...form.getInputProps("location")}
              />

              <TextInput
                label="Lĩnh vực"
                placeholder="Công nghệ, tài chính..."
                leftSection={<IconBuilding size={16} />}
                {...form.getInputProps("industry")}
              />

              <TextInput
                label="Quy mô công ty"
                placeholder="1-50, 51-200..."
                leftSection={<IconUsers size={16} />}
                {...form.getInputProps("companySize")}
              />

              {logoPreview && (
                <Image
                  src={logoPreview}
                  alt="Logo công ty"
                  radius="md"
                  h={120}
                  fit="contain"
                  style={{ gridColumn: "span 2" }}
                />
              )}

              <Textarea
                label="Mô tả công ty"
                placeholder="Giới thiệu về công ty..."
                autosize
                minRows={4}
                style={{ gridColumn: "span 2" }}
                {...form.getInputProps("description")}
              />

            </SimpleGrid>

            <Divider my="lg" />

            <Group justify="flex-end">

              <Button
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Hủy
              </Button>

              <Button
                type="submit"
                loading={loading}
                leftSection={<IconCheck size={16} />}
              >
                {isEdit ? "Cập nhật công ty" : "Tạo công ty"}
              </Button>

            </Group>

          </form>

        </Paper>

      </Container>

    </div>
  );
};

export default EmployerCompanyPage;