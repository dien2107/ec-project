import React, { useState } from "react";
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
} from "lucide-react";
import { BankAccountModal } from "./components/bank-acount-dialog";
import { EWalletModal } from "./components/ewallet-dialog";
import { mockBankAccounts, mockEWallets } from "./data/data";
import type { BankAccount, EWallet } from "./types";

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState({
    bankTransfer: true,
    cod: true,
    eWallet: true,
  });
  const [showBankModal, setShowBankModal] = useState(false);
  const [showEWalletModal, setShowEWalletModal] = useState(false);
  const [bankAccounts, setBankAccounts] =
    useState<BankAccount[]>(mockBankAccounts);
  const [eWallets, setEWallets] = useState<EWallet[]>(mockEWallets);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [editingWallet, setEditingWallet] = useState<EWallet | null>(null);
  const togglePaymentMethod = (method: keyof typeof paymentMethods) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const toggleBankAccount = (id: number) => {
    setBankAccounts(prev =>
      prev.map(bank =>
        bank.id === id ? { ...bank, enabled: !bank.enabled } : bank
      )
    );
  };

  const toggleEWallet = (id: number) => {
    setEWallets(prev =>
      prev.map(wallet =>
        wallet.id === id ? { ...wallet, enabled: !wallet.enabled } : wallet
      )
    );
  };

  const handleEditBank = (bank: BankAccount) => {
    setEditingBank(bank);
    setShowBankModal(true);
  };

  const handleEditWallet = (wallet: EWallet) => {
    setEditingWallet(wallet);
    setShowEWalletModal(true);
  };

  const handleDeleteBank = (id: number) => {
    setBankAccounts(prev => prev.filter(bank => bank.id !== id));
  };

  const handleDeleteWallet = (id: number) => {
    setEWallets(prev => prev.filter(wallet => wallet.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý phương thức thanh toán
          </h1>
          <p className="text-muted-foreground">
            Cấu hình các phương thức thanh toán cho cửa hàng
          </p>
        </div>
      </div>

      {/* Payment Methods Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Bank Transfer */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Chuyển khoản ngân hàng
            </CardTitle>
            <Switch
              checked={paymentMethods.bankTransfer}
              onCheckedChange={() => togglePaymentMethod("bankTransfer")}
            />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Thanh toán qua chuyển khoản ngân hàng
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!paymentMethods.bankTransfer}
            >
              <CreditCard className="h-3.5 w-3.5 mr-1" />
              Quản lý tài khoản
            </Button>
          </CardContent>
        </Card>

        {/* COD */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Thanh toán khi nhận hàng
            </CardTitle>
            <Switch
              checked={paymentMethods.cod}
              onCheckedChange={() => togglePaymentMethod("cod")}
            />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Khách hàng thanh toán khi nhận hàng (COD)
            </p>
          </CardContent>
        </Card>

        {/* E-Wallet */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Ví điện tử
            </CardTitle>
            <Switch
              checked={paymentMethods.eWallet}
              onCheckedChange={() => togglePaymentMethod("eWallet")}
            />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Thanh toán qua ví điện tử
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!paymentMethods.eWallet}
            >
              <Wallet className="h-3.5 w-3.5 mr-1" />
              Quản lý ví
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bank Transfer Management */}
      {paymentMethods.bankTransfer && (
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Quản lý tài khoản ngân hàng
            </CardTitle>
            <Button onClick={() => setShowBankModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm tài khoản
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {bankAccounts.map(bank => (
                <div
                  key={bank.id}
                  className="flex items-center justify-between p-4 border rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{bank.logo}</div>
                    <div>
                      <div className="font-medium">{bank.bankName}</div>
                      <div className="text-sm text-muted-foreground">
                        {bank.accountName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        STK: {bank.accountNumber}
                      </div>
                    </div>
                    <Badge variant={bank.enabled ? "default" : "secondary"}>
                      {bank.enabled ? "Đang hoạt động" : "Đã tắt"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={bank.enabled}
                      onCheckedChange={() => toggleBankAccount(bank.id)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBank(bank)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBank(bank.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* E-Wallet Management */}
      {paymentMethods.eWallet && (
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Quản lý ví điện tử
            </CardTitle>
            <Button onClick={() => setShowEWalletModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm ví
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {eWallets.map(wallet => (
                <div
                  key={wallet.id}
                  className="flex items-center justify-between p-4 border rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{wallet.logo}</div>
                    <div>
                      <div className="font-medium">{wallet.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {wallet.ownerName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {wallet.identifier}
                      </div>
                    </div>
                    <Badge variant={wallet.enabled ? "default" : "secondary"}>
                      {wallet.enabled ? "Đang hoạt động" : "Đã tắt"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={wallet.enabled}
                      onCheckedChange={() => toggleEWallet(wallet.id)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditWallet(wallet)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWallet(wallet.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <BankAccountModal
        open={showBankModal}
        onOpenChange={setShowBankModal}
        editingBank={editingBank}
        onSave={bankData => {
          if (editingBank) {
            setBankAccounts(prev =>
              prev.map(bank =>
                bank.id === editingBank.id ? { ...bank, ...bankData } : bank
              )
            );
          } else {
            setBankAccounts(prev => [
              ...prev,
              {
                id: Date.now(),
                enabled: true,
                logo: "🏦",
                bankName: bankData.bankName,
                accountName: bankData.accountName,
                accountNumber: bankData.accountNumber,
              },
            ]);
          }
          setShowBankModal(false);
          setEditingBank(null);
        }}
        onCancel={() => {
          setShowBankModal(false);
          setEditingBank(null);
        }}
      />

      <EWalletModal
        open={showEWalletModal}
        onOpenChange={setShowEWalletModal}
        editingWallet={editingWallet}
        onSave={walletData => {
          if (editingWallet) {
            setEWallets(prev =>
              prev.map(wallet =>
                wallet.id === editingWallet.id
                  ? { ...wallet, ...walletData }
                  : wallet
              )
            );
          } else {
            setEWallets(prev => [
              ...prev,
              {
                id: Date.now(),
                enabled: true,
                logo: "💰",
                name: walletData.name,
                ownerName: walletData.ownerName,
                identifier: walletData.identifier,
              },
            ]);
          }
          setShowEWalletModal(false);
          setEditingWallet(null);
        }}
        onCancel={() => {
          setShowEWalletModal(false);
          setEditingWallet(null);
        }}
      />
    </div>
  );
};

export default PaymentMethods;
