import { Avatar, Button, Divider } from "@mantine/core";
import { IconBriefcase, IconMapPin } from "@tabler/icons-react";
import ExpCard from "./ExpCard";
import CertiCard from "./CertiCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../../Services/ProfileService";
import { useMediaQuery } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";

const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const matches = useMediaQuery("(max-width: 475px)");

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(showOverlay());
        window.scrollTo(0, 0);
        getProfile(id)
            .then((res) => {
                setProfile(res);
            })
            .catch((err) => console.log(err))
            .finally(() => dispatch(hideOverlay()));
    }, [id]);

    return (
        <div data-aos="zoom-out" className="w-full flex justify-center px-3 md:px-6 py-6 md:py-10 bg-gradient-to-b from-oceanTeal-50/30 to-white">
            <div className="w-full max-w-5xl">
                <div className="rounded-[28px] overflow-hidden border border-oceanTeal-100 bg-white shadow-[0_18px_55px_rgba(45,212,191,0.18)]">
                    <div className="relative">
                        <img
                            className="h-56 md-mx:h-44 xs-mx:h-36 w-full object-cover"
                            src="/Profile/banner.jpg"
                            alt="profile-banner"
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />

                        <div className="absolute -bottom-14 md-mx:-bottom-12 xs-mx:-bottom-10 left-1/2 -translate-x-1/2">
                            <div className="rounded-full p-1.5 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.25)] ring-4 ring-oceanTeal-100">
                                <Avatar
                                    className="!w-32 !h-32 md-mx:!w-24 md-mx:!h-24 xs-mx:!w-20 xs-mx:!h-20 border-4 border-white"
                                    src={profile?.picture ? `data:image/jpeg;base64,${profile?.picture}` : "/avatar.png"}
                                    alt="avatar"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 md-mx:px-4 pt-20 md-mx:pt-16 pb-8 text-center">
                        <div className="flex justify-center mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-oceanTeal-50 text-oceanTeal-600 border border-oceanTeal-200">
                                Talent Profile
                            </span>
                        </div>

                        <div className="text-3xl md-mx:text-2xl font-bold tracking-tight text-deepSlate-900">
                            {profile?.name || "Candidate"}
                        </div>

                        <div className="mt-2 text-base md-mx:text-sm text-deepSlate-500 flex flex-wrap gap-x-2 gap-y-1 items-center justify-center">
                            <span className="inline-flex items-center gap-1">
                                <IconBriefcase className="h-4 w-4" stroke={1.7} />
                                {profile?.jobTitle || "-"}
                            </span>
                            <span>•</span>
                            <span>{profile?.company || "-"}</span>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <Button
                                size={matches ? "sm" : "md"}
                                color="oceanTeal.4"
                                radius="xl"
                                variant="filled"
                                className="!font-semibold !px-8 shadow-[0_8px_20px_rgba(45,212,191,0.35)]"
                            >
                                Message
                            </Button>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                            <div className="rounded-2xl border border-oceanTeal-100 bg-gradient-to-br from-oceanTeal-50 to-white px-4 py-3 text-sm text-deepSlate-700 flex items-center gap-2 shadow-sm">
                                <IconMapPin className="h-4 w-4 shrink-0 text-oceanTeal-600" stroke={1.7} />
                                <span className="truncate">{profile?.location || "Unknown location"}</span>
                            </div>
                            <div className="rounded-2xl border border-oceanTeal-100 bg-gradient-to-br from-oceanTeal-50 to-white px-4 py-3 text-sm text-deepSlate-700 flex items-center gap-2 shadow-sm">
                                <IconBriefcase className="h-4 w-4 shrink-0 text-oceanTeal-600" stroke={1.7} />
                                <span>Experience: {profile?.totalExp ?? 0} Years</span>
                            </div>
                        </div>

                        <Divider my="xl" />

                        <section className="text-left">
                            <div className="text-2xl md-mx:text-xl font-semibold mb-3">About</div>
                            <div className="text-[15px] leading-7 text-deepSlate-600 text-justify bg-deepSlate-50/70 border border-deepSlate-100 rounded-2xl p-4">
                                {profile?.about || "No description provided."}
                            </div>
                        </section>

                        <Divider my="xl" />

                        <section className="text-left">
                            <div className="text-2xl md-mx:text-xl font-semibold mb-4">Skills</div>
                            <div className="flex flex-wrap gap-2.5">
                                {profile?.skills?.length ? (
                                    profile.skills.map((skill: any, index: any) => (
                                        <div
                                            key={index}
                                            className="rounded-full px-3.5 py-1.5 text-sm font-semibold bg-oceanTeal-100 text-oceanTeal-700 border border-oceanTeal-300 shadow-sm"
                                        >
                                            {skill}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-deepSlate-400 text-sm">No skills listed.</div>
                                )}
                            </div>
                        </section>

                        <Divider my="xl" />

                        <section className="text-left">
                            <div className="text-2xl md-mx:text-xl font-semibold mb-4">Experience</div>
                            <div className="flex flex-col gap-6">
                                {profile?.experiences?.length ? (
                                    profile.experiences.map((exp: any, index: any) => <ExpCard key={index} {...exp} />)
                                ) : (
                                    <div className="text-deepSlate-400 text-sm">No experience data.</div>
                                )}
                            </div>
                        </section>

                        <Divider my="xl" />

                        <section className="text-left">
                            <div className="text-2xl md-mx:text-xl font-semibold mb-4">Certifications</div>
                            <div className="flex flex-col gap-6">
                                {profile?.certifications?.length ? (
                                    profile.certifications.map((certi: any, index: any) => <CertiCard key={index} {...certi} />)
                                ) : (
                                    <div className="text-deepSlate-400 text-sm">No certifications available.</div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
