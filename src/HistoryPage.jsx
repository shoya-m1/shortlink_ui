import React from "react";
import LoginHistory from "./components/LoginHistory";

const HistoryPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">History</h1>

            {/* Login History Section */}
            <LoginHistory />
        </div>
    );
};

export default HistoryPage;
