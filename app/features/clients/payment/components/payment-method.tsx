import { Form, FormField, FormItem, FormControl } from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Banknote, Truck } from "lucide-react";
import { z } from "zod";
import { type UseFormReturn } from "react-hook-form";

const paymentSchema = z.object({
  paymentMethod: z.enum(["bank", "cod"]),
});

type PaymentForm = UseFormReturn<z.infer<typeof paymentSchema>>;

export default function PaymentMethodSection({ form }: { form: PaymentForm }) {
  const selected = form.watch("paymentMethod");

  return (
    <div className="border rounded-xl p-6 bg-white shadow-sm">
      <h2 className="font-bold text-lg mb-5 text-gray-800">
        Phương thức thanh toán
      </h2>

      <Form {...form}>
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="space-y-4"
                >
                  {/* 🔹 BANK */}
                  <div
                    className={`flex items-center gap-3 border rounded-lg p-4 transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50 ${
                      selected === "bank"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onClick={() => field.onChange("bank")}
                  >
                    <RadioGroupItem value="bank" id="bank" />
                    <Banknote className="text-blue-600" />
                    <label
                      htmlFor="bank"
                      className="cursor-pointer font-medium text-gray-800"
                    >
                      Thanh toán online qua ngân hàng
                    </label>
                  </div>

                  {/* 🔹 COD */}
                  <div
                    className={`flex items-center gap-3 border rounded-lg p-4 transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50 ${
                      selected === "cod"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onClick={() => field.onChange("cod")}
                  >
                    <RadioGroupItem value="cod" id="cod" />
                    <Truck className="text-green-600" />
                    <label
                      htmlFor="cod"
                      className="cursor-pointer font-medium text-gray-800"
                    >
                      Thanh toán khi nhận hàng (COD)
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
}
