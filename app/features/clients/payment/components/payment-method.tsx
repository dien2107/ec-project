import { Form, FormField, FormItem, FormControl } from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { z } from "zod";
import { type UseFormReturn } from "react-hook-form";

const paymentSchema = z.object({
  paymentMethod: z.enum(["bank", "cod"]),
});

type PaymentForm = UseFormReturn<z.infer<typeof paymentSchema>>;

export default function PaymentMethodSection({
  form,
}: {
  form: PaymentForm;
}) {
  return (
    <div className="border rounded-md p-6">
      <h2 className="font-bold text-lg mb-4">Phương thức thanh toán</h2>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="space-y-3"
                  >
                    <div
                      className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer ${
                        field.value === "bank" ? "border-primary" : ""
                      }`}
                    >
                      <RadioGroupItem value="bank" id="bank" />
                      <label htmlFor="bank">Thanh toán online qua ngân hàng</label>
                    </div>

                    <div
                      className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer ${
                        field.value === "cod" ? "border-primary" : ""
                      }`}
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>

      {form.watch("paymentMethod") === "bank" && (
        <div className="border mt-4 rounded p-4 bg-blue-50 text-sm">
          <p>Ngân hàng: <strong>VCB - Vietcombank</strong></p>
          <p>Số tài khoản: <strong>1234567890</strong></p>
          <p>Chủ tài khoản: <strong>CÔNG TY TNHH XYZ</strong></p>
          <p>Nội dung: <strong>Thanh toan don hang online</strong></p>
        </div>
      )}
    </div>
  );
}
