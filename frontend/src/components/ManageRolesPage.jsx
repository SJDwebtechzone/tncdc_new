import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, RotateCcw, ArrowLeft, ShieldCheck, Tag, CheckSquare, Trash2, Pencil } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { addRole, deleteRole, fetchRoles, updateRole } from '@/store/roleSlice';

const ALL_MODULES = [
    { name: "Dashboard", actions: ["view"] },
    { name: "Franchise Plans", actions: ["view", "add", "edit", "delete"] },
    { name: "Franchisees", actions: ["view", "add", "edit", "delete"] },
    { name: "Franchise Wallets", actions: ["view", "add", "edit", "delete"] },
    { name: "Exam Grade System", actions: ["view", "add", "edit", "delete"] },
    { name: "Languages", actions: ["view", "edit"] },
    { name: "Subjects", actions: ["view", "add", "edit", "delete"] },
    { name: "Course Categories", actions: ["view", "add", "edit", "delete"] },
    { name: "Courses", actions: ["view", "add", "edit", "delete"] },
    { name: "Franchise Courses", actions: ["view", "add", "edit", "delete"] },
    { name: "Online Classes", actions: ["view", "add", "edit", "delete"] },
    { name: "Course Videos", actions: ["view", "add", "edit", "delete"] },
    { name: "Course Notes", actions: ["view", "add", "edit", "delete"] },
    { name: "Course Reviews", actions: ["view", "add", "edit", "delete"] },
    { name: "My Courses", actions: ["view"] },
    { name: "My Course details", actions: ["view"] },
    { name: "My Course videos", actions: ["view"] },
    { name: "My Course Notes", actions: ["view"] },
    { name: "Batches", actions: ["view", "add", "edit", "delete"] },
    { name: "Students", actions: ["view", "add", "edit", "delete"] },
    { name: "Enquiries", actions: ["view", "add", "edit", "delete"] },
    { name: "Admissions", actions: ["view", "add", "edit", "delete"] },
    { name: "ID Cards", actions: ["view", "add"] },
    { name: "Support", actions: ["view", "add", "edit", "delete"] },
    { name: "Birthdays", actions: ["view"] },
    { name: "Fee Management", actions: ["view", "add", "edit", "delete"] },
    { name: "Upcoming Installments", actions: ["view"] },
    { name: "Paid Installments", actions: ["view"] },
    { name: "Payments", actions: ["view"] },
    { name: "Student Wallet", actions: ["view", "add", "edit", "delete"] },
    { name: "Attendance", actions: ["view", "add", "edit", "delete"] },
    { name: "Leaves", actions: ["view", "add", "edit", "delete"] },
    { name: "Holidays", actions: ["view", "add", "edit", "delete"] },
    { name: "Week Off", actions: ["view", "add", "edit", "delete"] },
    { name: "Hall Tickets", actions: ["view", "add"] },
    { name: "Mock Tests", actions: ["view", "add", "edit", "delete"] },
    { name: "Mock Test Results", actions: ["view"] },
    { name: "Final Exams", actions: ["view", "add", "edit", "delete"] },
    { name: "Final Exam Results", actions: ["view"] },
    { name: "Exam Requests", actions: ["view", "add", "edit", "delete"] },
    { name: "Update Marks", actions: ["view", "add", "edit", "delete"] },
    { name: "Certificate To Apply", actions: ["view", "add", "edit", "delete"] },
    { name: "Approved Certificates", actions: ["view"] },
    { name: "Requested Certificates", actions: ["view", "add", "edit", "delete"] },
    { name: "HDI Certificate Marksheets", actions: ["view", "add", "edit", "delete"] },
    { name: "Background Images", actions: ["view", "add", "edit", "delete"] },
    { name: "Expense Types", actions: ["view", "add", "edit", "delete"] },
    { name: "Expense Subtypes", actions: ["view", "add", "edit", "delete"] },
    { name: "Expenses", actions: ["view", "add", "edit", "delete"] },
    { name: "Inventory Categories", actions: ["view", "add", "edit", "delete"] },
    { name: "Inventory Products", actions: ["view", "add", "edit", "delete"] },
    { name: "Student Inventories", actions: ["view", "add", "edit", "delete"] },
    { name: "Users", actions: ["view", "add", "edit", "delete"] },
    { name: "Roles", actions: ["view", "add", "edit", "delete"] },
    { name: "Popups", actions: ["view", "add", "edit", "delete"] },
    { name: "Settings", actions: ["view", "add", "edit", "delete"] },
    { name: "Staff", actions: ["view", "add", "edit", "delete"] },
    { name: "Staff Attendance", actions: ["view", "edit"] },
    { name: "Staff Leaves", actions: ["view"] },
    { name: "Staff Salary", actions: ["view"] },
    { name: "Payslips", actions: ["view"] }
];

const PERMISSION_TYPES = ['view', 'add', 'edit', 'delete'];

export default function ManageRolesPage() {
    const dispatch = useDispatch();
    // Default to empty array if roles is undefined
    const roles = useSelector((state) => state.roles?.roles || []);

    const [view, setView] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleName, setRoleName] = useState('');
    const [editingRole, setEditingRole] = useState(null);
    const [moduleSearch, setModuleSearch] = useState('');

    // Permission state: { "ModuleName": { view: boolean, add: boolean, ... } }
    const [permissions, setPermissions] = useState({});

    // Initialize permissions state and fetch roles
    useEffect(() => {
        dispatch(fetchRoles());
        resetForm();
    }, [dispatch]);

    const resetForm = () => {
        setRoleName('');
        setEditingRole(null);
        const initialPermissions = {};
        ALL_MODULES.forEach(mod => {
            initialPermissions[mod.name] = {
                view: false,
                add: false,
                edit: false,
                delete: false
            };
        });
        setPermissions(initialPermissions);
    };

    const togglePermission = (module, type) => {
        setPermissions(prev => ({
            ...prev,
            [module]: {
                ...prev[module],
                [type]: !prev[module][type]
            }
        }));
    };

    const toggleModuleAll = (moduleName, validActions) => {
        const currentModulePerms = permissions[moduleName];
        if (!currentModulePerms) return;
        const allSelected = validActions.every(type => currentModulePerms[type]);

        const updated = { ...currentModulePerms };
        validActions.forEach(type => {
            updated[type] = !allSelected;
        });

        setPermissions(prev => ({
            ...prev,
            [moduleName]: updated
        }));
    };

    const toggleGlobalAll = () => {
        // Check if every valid permission is true across all modules
        const allSelected = ALL_MODULES.every(mod =>
            mod.actions.every(type => permissions[mod.name]?.[type])
        );

        const newPermissions = {};
        ALL_MODULES.forEach(mod => {
            const up = { view: false, add: false, edit: false, delete: false };
            mod.actions.forEach(type => {
                up[type] = !allSelected;
            });
            newPermissions[mod.name] = up;
        });
        setPermissions(newPermissions);
    };

    const handleEditRole = (role) => {
        setRoleName(role.name);
        setEditingRole(role);
        
        // Ensure all modules are represented in the permissions state
        const rolePermissions = role.permissions || {};
        const mergedPermissions = {};
        
        ALL_MODULES.forEach(mod => {
            mergedPermissions[mod.name] = rolePermissions[mod.name] || {
                view: false,
                add: false,
                edit: false,
                delete: false
            };
        });
        
        setPermissions(mergedPermissions);
        setView('add');
    };

    const handleSaveRole = async () => {
        if (!roleName.trim()) {
            alert("Please enter a role name");
            return;
        }

        const roleData = {
            name: roleName,
            permissions: permissions
        };

        if (editingRole) {
            await dispatch(updateRole({ ...roleData, id: editingRole.id }));
        } else {
            await dispatch(addRole(roleData));
        }
        
        setView('list');
        resetForm();
    };

    const handleDeleteRole = async (id) => {
        if (confirm("Are you sure you want to delete this role?")) {
            await dispatch(deleteRole(id));
        }
    };

    const filteredModules = ALL_MODULES.filter(m =>
        m.name.toLowerCase().includes(moduleSearch.toLowerCase())
    );

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (view === 'add') {
        return (
            <div className="space-y-6 bg-gray-50/50 min-h-screen">
                {/* Top Navigation */}
                <div className="flex justify-end mb-4">
                    <Button
                        onClick={() => setView('list')}
                        variant="outline"
                        className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 gap-2 shadow-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Roles
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {/* Role Name Section */}
                    <div className="mb-8 space-y-2">
                        <label className="text-sm font-bold text-gray-700">Role Name</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                placeholder="Enter role name"
                                className="pl-10 h-11 border-gray-200 bg-gray-50/30"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Permissions Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Assign Permissions</h2>
                        <Button
                            onClick={toggleGlobalAll}
                            className="bg-[#14532d] hover:bg-[#14532d]/90 text-white gap-2"
                        >
                            <CheckSquare size={16} /> Select All Permissions
                        </Button>
                    </div>

                    {/* Module Search */}
                    <div className="mb-6 max-w-sm">
                        <Input
                            placeholder="Search modules..."
                            value={moduleSearch}
                            onChange={(e) => setModuleSearch(e.target.value)}
                            className="bg-white border-gray-200"
                        />
                    </div>

                    {/* Permissions Table */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[40%] font-bold text-gray-600 text-xs uppercase tracking-wider pl-6">MODULE</TableHead>
                                    <TableHead className="text-center font-bold text-gray-600 text-xs uppercase tracking-wider">VIEW</TableHead>
                                    <TableHead className="text-center font-bold text-gray-600 text-xs uppercase tracking-wider">ADD</TableHead>
                                    <TableHead className="text-center font-bold text-gray-600 text-xs uppercase tracking-wider">EDIT</TableHead>
                                    <TableHead className="text-center font-bold text-gray-600 text-xs uppercase tracking-wider">DELETE</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredModules.map((moduleObj) => {
                                    const moduleName = moduleObj.name;
                                    const modulePerms = permissions[moduleName] || { view: false, add: false, edit: false, delete: false };
                                    const isAllSelected = moduleObj.actions.length > 0 && moduleObj.actions.every(type => modulePerms[type]);

                                    return (
                                        <TableRow key={moduleName} className="hover:bg-gray-50 border-b border-gray-100">
                                            <TableCell className="font-medium text-gray-700 pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {moduleObj.actions.length > 0 && (
                                                        <input
                                                            type="checkbox"
                                                            checked={isAllSelected}
                                                            onChange={() => toggleModuleAll(moduleName, moduleObj.actions)}
                                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                        />
                                                    )}
                                                    {moduleName}
                                                </div>
                                            </TableCell>
                                            {PERMISSION_TYPES.map(type => (
                                                <TableCell key={type} className="text-center">
                                                    {moduleObj.actions.includes(type) ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={modulePerms[type]}
                                                            onChange={() => togglePermission(moduleName, type)}
                                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                        />
                                                    ) : null}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        <Button onClick={handleSaveRole} className="bg-[#0f172a] hover:bg-[#0f172a]/90 text-white min-w-[120px]">
                            {editingRole ? 'Update Role' : 'Save Role'}
                        </Button>
                        <Button variant="outline" onClick={() => setView('list')} className="text-orange-500 border-orange-200 hover:bg-orange-50 min-w-[120px]">
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-xl font-medium text-gray-800">Manage Roles</h1>
                <Button
                    onClick={() => { resetForm(); setView('add'); }}
                    className="bg-[#0f172a] hover:bg-[#0f172a]/90 text-white gap-2 h-10 px-6 font-normal"
                >
                    <Plus size={18} />
                    Add New Role
                </Button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-8 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={18} />
                        </div>
                        <Input
                            placeholder="Search roles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-10 bg-white border-gray-200"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Button className="w-full bg-[#0f172a] hover:bg-[#0f172a]/90 text-white h-10">
                            Search
                        </Button>
                    </div>
                    <div className="md:col-span-2">
                        <Button variant="outline" onClick={() => setSearchTerm('')} className="w-full text-orange-500 border-orange-200 hover:bg-orange-50 h-10 gap-2">
                            <RotateCcw size={16} />
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#f1f5f9] border-b border-gray-200">
                                <TableHead className="font-bold text-gray-700 text-xs uppercase py-4 px-6">#</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase py-4">Role Name</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase py-4">Created At</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase py-4 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRoles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-16 text-center border-b border-gray-100">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="bg-gray-50 p-4 rounded-full">
                                                <ShieldCheck size={32} className="text-gray-300" />
                                            </div>
                                            <p className="font-medium text-gray-500">No Roles Found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRoles.map((role, index) => (
                                    <TableRow key={role.id} className="hover:bg-gray-50 border-b border-gray-100">
                                        <TableCell className="font-medium text-gray-500 py-3 pl-6 border-r border-gray-200 text-xs">{index + 1}</TableCell>
                                        <TableCell className="font-medium text-gray-600 text-xs border-r border-gray-200">{role.name}</TableCell>
                                        <TableCell className="text-gray-500 text-xs border-r border-gray-200">{role.createdAt}</TableCell>
                                        <TableCell className="text-center py-2">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleEditRole(role)}
                                                >
                                                    <Pencil size={14} />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                    onClick={() => handleDeleteRole(role.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}







// Trigger HMR
