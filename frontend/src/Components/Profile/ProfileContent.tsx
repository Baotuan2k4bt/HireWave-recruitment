import { useState } from 'react';
import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import CertificationsSection from './CertificationsSection';

interface ProfileContentProps {
    profile: any;
}

const ProfileContent = ({ profile }: ProfileContentProps) => {
    return (
        <div className="space-y-6">
            <AboutSection profile={profile} />
            <SkillsSection profile={profile} />
            <ExperienceSection profile={profile} />
            <CertificationsSection profile={profile} />
        </div>
    );
};

export default ProfileContent;

