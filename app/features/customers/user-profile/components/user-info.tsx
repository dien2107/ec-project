

import React, { useState } from "react";
import UserInfoView from "./user-info/user-info-view";
import UserInfoEdit from "./user-info/user-info-edit";

const mockUser = {
	name: "Nguyễn Văn A",
	email: "nguyenvana@example.com",
	phone: "0912345678",
};


export default function UserInfo() {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState(mockUser);
	const [editUser, setEditUser] = useState(mockUser);

	const handleEdit = () => {
		setEditUser(user);
		setOpen(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditUser({ ...editUser, [e.target.name]: e.target.value });
	};

	const handleSave = () => {
		setUser(editUser);
		setOpen(false);
	};

	return (
		<div className="max-w-4xl mx-auto mt-8">
			<h2 className="text-2xl font-semibold mb-6">Tài khoản của tôi</h2>
			<div className="flex gap-6">
				{/* Sidebar */}
				{/* Main content */}
				<UserInfoView
					name={user.name}
					email={user.email}
					phone={user.phone}
					onEdit={handleEdit}
				/>
			</div>

			{/* Dialog chỉnh sửa */}
			{open && (
				<UserInfoEdit
					name={editUser.name}
					email={editUser.email}
					phone={editUser.phone}
					onChange={handleChange}
					onSave={handleSave}
					onClose={() => setOpen(false)}
				/>
			)}
		</div>
	);
}
