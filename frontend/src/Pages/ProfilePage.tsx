import { Divider } from "@mantine/core";
import Profile from "../Components/Profile/Profile";

const ProfilePage = () => {
    return <div className="min-h-[90vh] bg-white">
        <Divider mx="md" mb="xl" />
        
            <Profile />
    </div>
}
export default ProfilePage;