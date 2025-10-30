import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  CreditCard,
  Truck,
  Wallet,
  Plus,
  Edit,
  Trash2,
  Building2,
  Smartphone,
  Loader2,
} from "lucide-react";
import { BankAccountModal } from "./components/bank-acount-dialog";
import { EWalletModal } from "./components/ewallet-dialog";
import type { BankAccount, EWallet } from "./types";

import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchPaymentDestinations } from "~/redux/slices/payment-destinations";
import { ToggleStatus } from "~/services/payment-destination";
import { toast } from "react-hot-toast";
import type { PaymentDestination } from "~/types/payment/payment-destination";

const PaymentMethods = () => {
  const dispatch = useAppDispatch();
  const { paymentDestinationList } = useAppSelector(
    (s) => s.paymentDestinationList
  );
  // loadingId holds destinationId currently being toggled (per-row loading)
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchPaymentDestinations());
  }, [dispatch]);

  useEffect(() => {}, [paymentDestinationList]);

  const handleToggleStatus = async (method: PaymentDestination) => {
    try {
      // mark this row as loading
      setLoadingId(method.destinationId);
      await ToggleStatus(method.destinationId);
      toast.success("Cập nhật trạng thái phương thức vận chuyển thành công");
      dispatch(fetchPaymentDestinations());
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
      }
    } finally {
      // clear loading flag for this row
      setLoadingId(null);
    }
  };

  const banksList = useMemo(() => {
    if (!paymentDestinationList) return [];
    return paymentDestinationList.filter(
      (item) => item.paymentMethod?.methodType === "BankTransfer"
    );
  }, [paymentDestinationList]);

  const eWalletList = useMemo(() => {
    if (!paymentDestinationList) return [];
    return paymentDestinationList.filter(
      (item) => item.paymentMethod?.methodType === "EWallet"
    );
  }, [paymentDestinationList]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý phương thức thanh toán
          </h1>
        </div>
      </div>

      {/* Bank Transfer Management & E-Wallet Management (2-column grid) */}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Quản lý tài khoản ngân hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {banksList.map((bank) => (
                <div
                  key={bank.destinationId}
                  className="flex items-center justify-between p-4 border rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-sm overflow-hidden flex items-center justify-center bg-gray-100">
                      {bank.imageUrl ? (
                        <img
                          src={bank.imageUrl}
                          alt={bank.bankName ?? "logo"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-700">
                          {(bank.bankName ?? "")
                            .split(" ")
                            .map((s) => s[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join("")}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{bank.bankName} </div>
                      <div className="text-sm text-muted-foreground">
                        {bank.accountName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        STK: {bank.identifier}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {loadingId === bank.destinationId && (
                      <Loader2 className="animate-spin h-4 w-4 text-gray-500" />
                    )}
                    <Switch
                      checked={bank.status?.name.toLowerCase() === "active"}
                      onCheckedChange={() => handleToggleStatus(bank)}
                      disabled={loadingId === bank.destinationId}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Quản lý ví điện tử
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {eWalletList.map((wallet) => (
                <div
                  key={wallet.destinationId}
                  className="flex items-center justify-between p-4 border rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-sm overflow-hidden flex items-center justify-center bg-gray-100">
                      {wallet.imageUrl ? (
                        <img
                          src={wallet.imageUrl}
                          alt={wallet.bankName ?? "logo"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-700">
                          {(wallet.bankName ?? "")
                            .split(" ")
                            .map((s) => s[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join("")}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{wallet.bankName}</div>
                      <div className="text-sm text-muted-foreground">
                        {wallet.accountName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {wallet.identifier}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {loadingId === wallet.destinationId && (
                      <Loader2 className="animate-spin h-4 w-4 text-gray-500" />
                    )}
                    <Switch
                      checked={wallet.status?.name.toLowerCase() === "active"}
                      onCheckedChange={() => handleToggleStatus(wallet)}
                      disabled={loadingId === wallet.destinationId}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethods;
