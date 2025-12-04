// src/components/DashboardFooter.jsx
import { MessageCircle, Copy, MoreVertical } from 'lucide-react';

const DashboardFooter = () => (
    <footer className="flex flex-col items-center justify-between px-6 py-4 border-t bg-white md:flex-row md:px-8 lg:px-10">
        <div className="flex flex-wrap justify-center space-x-4 text-sm text-gray-500">
            <a href="#" className="hover:underline">
                Terms Of Services
            </a>
            <a href="#" className="hover:underline">
                Privacy Policy
            </a>
            <a href="#" className="hover:underline">
                About
            </a>
            <a href="#" className="hover:underline">
                Contact
            </a>
            <a href="#" className="hover:underline">
                Report Abuse
            </a>
        </div>
    </footer>
);

export default DashboardFooter;