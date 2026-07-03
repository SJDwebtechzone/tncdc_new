import React from 'react';
import { Button } from "@/components/ui/button";

const PlaceholderPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-xl font-medium text-gray-800">Page Content</h1>
                <div className="flex gap-2">
                    <Button variant="outline">Action 1</Button>
                    <Button>Action 2</Button>
                </div>
            </div>

            <div className="h-[400px] rounded-xl border border-gray-100 bg-white shadow-sm flex items-center justify-center">
                <p className="text-gray-400">Content goes here...</p>
            </div>
        </div>
    );
};

export default PlaceholderPage;






