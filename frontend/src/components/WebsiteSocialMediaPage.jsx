import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from 'react-redux';
import { updateSocialMediaSettings } from '@/store/websiteSlice';

const SocialField = ({ label, subtext, value, onChange, placeholder }) => (
    <div className="space-y-1.5">
        <label className="text-[12px] font-bold text-gray-700 tracking-tight">
            {label} URL
        </label>
        <Input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="h-10 border-gray-200 rounded-sm text-xs focus:ring-1 focus:ring-[#0f172a]"
        />
        <p className="text-[11px] text-gray-400 italic font-medium">
            {subtext}
        </p>
    </div>
);

export default function WebsiteSocialMediaPage() {
    const settings = useSelector((state) => state.website.socialMediaSettings);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(settings);

    const handleUpdate = () => {
        dispatch(updateSocialMediaSettings(formData));
        alert("Social media links updated successfully!");
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 pt-4 px-6">
            <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-10 space-y-10">
                <h2 className="text-[16px] font-bold text-gray-800 tracking-tight -mt-2">
                    Social Media Links
                </h2>

                <div className="space-y-8">
                    <SocialField
                        label="Facebook"
                        subtext="Enter the Facebook profile or page URL (e.g., https://facebook.com/yourpage)"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        placeholder=""
                    />

                    <SocialField
                        label="X"
                        subtext="Enter the X profile URL (e.g., https://x.com/yourprofile)"
                        value={formData.x}
                        onChange={(e) => setFormData({ ...formData, x: e.target.value })}
                        placeholder=""
                    />

                    <SocialField
                        label="Instagram"
                        subtext="Enter the Instagram profile URL (e.g., https://instagram.com/yourprofile)."
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder=""
                    />

                    <SocialField
                        label="Linkedin"
                        subtext="Enter the LinkedIn profile or company URL (e.g., https://linkedin.com/in/yourprofile)."
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder=""
                    />

                    <SocialField
                        label="YouTube"
                        subtext="Enter the YouTube channel URL (e.g., https://youtube.com/@yourchannel)."
                        value={formData.youtube}
                        onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                        placeholder=""
                    />
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <Button
                        onClick={() => setFormData(settings)}
                        className="bg-[#b9875a] hover:bg-[#a6764a] text-white border-none h-10 text-[11px] font-bold px-12 rounded-sm shadow-sm transition-all uppercase tracking-wider"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        className="bg-[#0f172a] hover:bg-[#151c63] text-white h-10 text-[11px] font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}






