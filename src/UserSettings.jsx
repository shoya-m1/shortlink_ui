import React from "react";
import ChangePasswordForm from "./components/ChangePasswordForm";
import ProfileInfoForm from "./components/ProfileInfoForm";
import LoginHistory from "./components/LoginHistory";

const UserSettings = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">User Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <ProfileInfoForm />
                </div>
                <div>
                    <ChangePasswordForm />
                </div>
            </div>

            {/* Login History Section */}
            <LoginHistory />
        </div>
    );
};

export default UserSettings;
