import { Button, Divider } from "@mantine/core";
import Profile from "../Components/TalentProfile/Profile";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const TalentProfilePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[90vh] bg-white p-4">
            <Divider size="xs" mx="md" />
            <Button
                my="sm"
                onClick={() => navigate(-1)}
                color="oceanTeal.4"
                leftSection={<IconArrowLeft size={20} />}
                variant="light"
            >
                Back
            </Button>
            <div className="flex gap-5 lg-mx:flex-wrap">
                <Profile />
            </div>
        </div>
    );
};

export default TalentProfilePage;