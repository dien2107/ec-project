

import React, { useState } from "react";
import UserInfoView from "./user-info/user-info-view";
import UserInfoEdit from "./user-info/user-info-edit";
import type { UserDisplayInfo } from "../types/user-profile.types";

const mockUser: UserDisplayInfo = {
	username: "nguyenvana2024",
	full_name: "Nguyễn Văn A",
	email: "nguyenvana@example.com",
	phone: "0912345678",
	is_active: true,
	is_verify: true,
	created_at: "2024-01-15",
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
				<UserInfoView
					username={user.username}
					full_name={user.full_name}
					email={user.email}
					phone={user.phone}
					is_active={user.is_active}
					is_verify={user.is_verify}
					created_at={user.created_at}
					onEdit={handleEdit}
				/>
			</div>

			<UserInfoEdit
				open={open}
				username={editUser.username}
				full_name={editUser.full_name}
				email={editUser.email}
				phone={editUser.phone}
				is_active={editUser.is_active}
				is_verify={editUser.is_verify}
				created_at={editUser.created_at}
				onChange={handleChange}
				onSave={handleSave}
				onClose={() => setOpen(false)}
			/>
		</div>
	);
}
