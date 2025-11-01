"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import DataTable from "~/features/system/components/data-table";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchCustomerListData } from "~/redux/slices/customers";
import { fetchStatuses } from "~/redux/slices/statuses";
import { ENTITY_TYPE } from "~/constants/entity-types";
import CustomerFilter from "~/features/system/customers/components/customer-filter";
import SkeletonFilter from "~/components/ui/skeleton-filter";
import SkeletonHeader from "~/components/ui/skeleton-header";
import SkeletonTable from "~/components/ui/skeleton-table";
import { UserModal } from "./components/user-modal";
import type { Customer, EntityStatus } from "~/features/system/customers/types";

export default function UserPermissionSystem() {
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 5;

  const { customerList, isLoading: isCustomerLoading } = useAppSelector(
    (state: any) =>
      state.customerList ?? { customerList: null, isLoading: false }
  );

  
  const userStatuses = useAppSelector(
    (state) => state.statuses.data?.[ENTITY_TYPE.USER] ?? []
  );
  const isStatusesLoading = useAppSelector((state) => state.statuses.isLoading);

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    Search?: string;
    Phone?: string;
    StatusName?: string | undefined;
  }>({});
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const reloadList = useCallback(
    (override?: { PageNumber?: number }) => {
      dispatch(
        fetchCustomerListData({
          PageNumber: override?.PageNumber ?? currentPage,
          PageSize: PAGE_SIZE,
          ...(filters.Search ? { Search: filters.Search } : {}),
          ...(filters.Phone ? { Phone: filters.Phone } : {}),
          ...(filters.StatusName ? { StatusName: filters.StatusName } : {}),
          HasRole: true,
        })
      );
    },
    [dispatch, currentPage, filters]
  );

  useEffect(() => {
    dispatch(fetchStatuses({ entityType: ENTITY_TYPE.USER }));
  }, [dispatch]);

  useEffect(() => {
    reloadList();
  }, [reloadList]);

  const handleFilterChange = useCallback((next: typeof filters) => {
    setFilters(next);
    setCurrentPage(1);
  }, []);

  const handleOpenModal = (user: Customer | null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const data: Customer[] =
    customerList?.data?.items ?? customerList?.data ?? [];

  const columns: ColumnDef<Customer>[] = [
    { accessorKey: "userId", header: "ID", size: 60 },
    { accessorKey: "fullName", header: "Họ tên" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "SĐT" },
    {
      accessorKey: "roles",
      header: "Quyền",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {(row.original.roles ?? []).map((r) => (
            <span
              key={r.roleId}
              className="px-2 py-1 bg-gray-100 rounded-full text-sm"
            >
              {r.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }) => {
        const status = getValue() as EntityStatus;
        const color =
          status?.name?.toLowerCase() === "active"
            ? "bg-green-100 text-green-700"
            : status?.name?.toLowerCase() === "inactive"
              ? "bg-red-100 text-red-700"
              : "bg-gray-200 text-gray-700";
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}
          >
            {status?.displayName ?? status?.name ?? "-"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(row.original);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="p-4">
      {/* Header + filter: show skeletons while statuses load */}
      {isStatusesLoading ? (
        <>
          <SkeletonHeader />
          <SkeletonFilter />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">
              Quản lý người dùng & phân quyền
            </h3>
            <Button onClick={() => handleOpenModal(null)}>
              + Thêm nhân viên
            </Button>
          </div>

          <CustomerFilter
            initial={filters}
            onChange={handleFilterChange}
            statuses={userStatuses}
            isLoading={isStatusesLoading}
          />
        </>
      )}

      {/* Table */}
      {isCustomerLoading ? (
        <SkeletonTable />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          currentPage={currentPage}
          totalPages={customerList?.data?.totalPages ?? 1}
          onPageChange={setCurrentPage}
        />
      )}

      {isModalOpen && (
        <UserModal
          id={selectedUser?.userId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSaved={() => {
            handleCloseModal();
            reloadList();
          }}
        />
      )}
    </div>
  );
}
