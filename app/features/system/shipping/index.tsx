import React, { useEffect, useState, useMemo } from "react";
import DataTable from "../components/data-table";
import { getColumns } from "./columns/ship";
import AddShippingDialog from "./components/add-shipping-dialog";
import EditShippingDialog from "./components/edit-shipping-dialog";
import DeleteShippingDialog from "./components/delete-shipping-dialog";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import type { Ship } from "~/types/ship";
import { fetchShipListData } from "~/redux/slices/ships";
import { fetchStatuses } from "~/redux/slices/statuses";
import ShippingFilter from "./components/shipping-filter";
import { ENTITY_TYPE } from "~/constants/entity-types";
import { setShippingActiveStatus } from "~/services/ships";
import toast from "react-hot-toast";

export default function ShippingMethodManagement() {
  const dispatch = useAppDispatch();
  const { shipList, isLoading } = useAppSelector((state) => state.shipList);
  const statuses = useAppSelector(
    (state) => state.statuses.data?.[ENTITY_TYPE.SHIP] ?? []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [filters, setFilters] = useState<{
    statusId?: number | undefined;
    corpName?: string;
  }>({
    statusId: undefined as number | undefined,
    corpName: "",
  });

  useEffect(() => {
    dispatch(
      fetchShipListData({
        PageNumber: currentPage,
        PageSize: pageSize,
        corpName: filters.corpName,
        statusId: filters.statusId,
      })
    );
  }, [dispatch, currentPage, pageSize, filters]);

  useEffect(() => {
    dispatch(fetchStatuses({ entityType: ENTITY_TYPE.SHIP }));
  }, [dispatch]);

  const [selectedMethod, setSelectedMethod] = useState<Ship | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // id của ship đang được cập nhật trạng thái (loading per-row)
  const [loadingShipId, setLoadingShipId] = useState<number | null>(null);

  const handleEdit = (method: Ship) => {
    setSelectedMethod(method);
    setIsEditOpen(true);
  };

  const handleDelete = (method: Ship) => {
    setSelectedMethod(method);
    setIsDeleteOpen(true);
  };

  const handleToggleStatus = async (method: Ship) => {
    try {
      if (method.status?.name === "Active") {
        return;
      }

      setLoadingShipId(method.shipId);
      await setShippingActiveStatus(method.shipId);
      toast.success("Cập nhật trạng thái phương thức vận chuyển thành công");
      setCurrentPage(1);
      dispatch(
        fetchShipListData({
          PageNumber: currentPage,
          PageSize: pageSize,
          corpName: filters.corpName,
          statusId: filters.statusId,
        })
      );
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
      }
    } finally {
      setLoadingShipId(null);
    }
  };

  const columns = useMemo(
    () =>
      getColumns(handleEdit, handleDelete, handleToggleStatus, loadingShipId),
    [handleEdit, handleDelete, handleToggleStatus, loadingShipId]
  );

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Quản lý phương thức vận chuyển</h3>
          <AddShippingDialog
            onAdded={() => {
              dispatch(
                fetchShipListData({
                  PageNumber: currentPage,
                  PageSize: pageSize,
                  corpName: filters.corpName,
                  statusId: filters.statusId,
                })
              );
            }}
          />
        </div>

        <ShippingFilter
          filters={filters}
          setFilters={setFilters}
          meta={statuses}
        />

        <DataTable
          columns={columns}
          data={shipList?.data?.items.flat() ?? []}
          currentPage={currentPage}
          totalPages={shipList?.data?.totalPages ?? 1}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Edit Modal */}
      <EditShippingDialog
        open={isEditOpen}
        setIsOpen={setIsEditOpen}
        method={selectedMethod}
        onEdited={() => {
          dispatch(
            fetchShipListData({
              PageNumber: currentPage,
              PageSize: pageSize,
              corpName: filters.corpName,
              statusId: filters.statusId,
            })
          );
        }}
      />

      {/* Delete Modal */}
      <DeleteShippingDialog
        open={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        method={selectedMethod}
        onDeleted={() => {
          dispatch(
            fetchShipListData({
              PageNumber: currentPage,
              PageSize: pageSize,
              corpName: filters.corpName,
              statusId: filters.statusId,
            })
          );
        }}
      />
    </>
  );
}
