import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { CustomerInfo } from "@shared/types";
import { customerInfoSchema } from "@shared/schema";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Local storage keys
const LS_CUSTOMER_INFO = 'foodOrder_customerInfo';
const LS_SAVE_INFO = 'foodOrder_saveInfo';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, total, subtotal, deliveryFee, setCustomerInfo, clearCart } =
    useCart();
  const [saveInfo, setSaveInfo] = useState(localStorage.getItem(LS_SAVE_INFO) === 'true');

  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  // Load saved customer info when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const savedInfo = localStorage.getItem(LS_CUSTOMER_INFO);
        if (savedInfo) {
          const customerInfo = JSON.parse(savedInfo) as CustomerInfo;
          form.reset(customerInfo);
        }
      } catch (error) {
        console.error('Error loading saved customer info:', error);
      }
    }
  }, [isOpen, form]);

  if (!isOpen) return null;

  const onSubmit = (data: CustomerInfo) => {
    setCustomerInfo(data);
    
    // Save customer info to local storage if checkbox is checked
    if (saveInfo) {
      localStorage.setItem(LS_CUSTOMER_INFO, JSON.stringify(data));
      localStorage.setItem(LS_SAVE_INFO, 'true');
    } else {
      localStorage.removeItem(LS_CUSTOMER_INFO);
      localStorage.removeItem(LS_SAVE_INFO);
    }

    // Create WhatsApp message
    let message = `*New Order*\n\n`;
    message += `*Customer:* ${data.name}\n`;
    message += `*Phone:* ${data.phone}\n`;
    message += `*Address:* ${data.address}\n`;

    if (data.notes) {
      message += `*Notes:* ${data.notes}\n`;
    }

    message += `\n*Order Details:*\n`;

    cart.forEach((item) => {
      message += `${item.quantity} × ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*Subtotal:* $${subtotal.toFixed(2)}`;
    message += `\n*Delivery Fee:* $${deliveryFee.toFixed(2)}`;
    message += `\n*Total:* $${total.toFixed(2)}`;

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);

    // Replace with your WhatsApp number
    const whatsappNumber = "9365605456"; // This should be configured in backend or env vars
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, "_blank");

    // Reset cart and close modals
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white rounded-t-xl absolute bottom-0 left-0 right-0 max-h-[95vh] overflow-y-auto transform transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b">
          <h2 className="font-heading font-semibold text-xl">Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Your Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Delivery Address
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Special Instructions (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center space-x-2 pt-3">
                <Checkbox 
                  id="saveInfo" 
                  checked={saveInfo}
                  onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                />
                <label
                  htmlFor="saveInfo"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Save my information for future orders
                </label>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="font-heading font-semibold mb-2">Order Summary</h3>
              <div className="text-sm mb-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span>
                      {item.quantity} × {item.name}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total Amount</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-secondary text-white py-3 rounded-md font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.507 14.307l.009.007a.5.5 0 00.713-.157l.003-.005a.493.493 0 00-.029-.544l-.947-1.178a.5.5 0 00-.705-.052l-.043.043a.49.49 0 00-.008.677l1.007 1.209z" />
                <path d="M20.903 16.5a.5.5 0 00-.313-.145.493.493 0 00-.393.154.5.5 0 00-.292.6 6.015 6.015 0 01-.773 4.396 6.022 6.022 0 01-3.684 2.21 6.023 6.023 0 01-4.502-.822 6.022 6.022 0 01-2.545-3.561l-.004-.015a.5.5 0 00-.578-.34l-.004.001a.5.5 0 00-.355.647l.005.016a7.022 7.022 0 002.97 4.152 7.03 7.03 0 005.253.959 7.028 7.028 0 004.294-2.58 7.014 7.014 0 00.915-5.667l-.004-.015z" />
                <path d="M13.563 18.5c-.654 0-1.294-.19-1.844-.553l-.068-.041a.5.5 0 00-.578.088l-.995.995a.5.5 0 00-.117.543.5.5 0 00.65.184c1.055-.5 1.985-.846 2.604-1.043a.5.5 0 00.335-.497.493.493 0 00-.186-.385 2.976 2.976 0 00-1.78-.635c-.684 0-1.287.331-1.905.812-.306.223-.607.463-.89.732a.5.5 0 00.17.787c.918.546 1.851.338 2.917-.317a.83.83 0 00.166-.08 2.979 2.979 0 00.421-4.416 2.986 2.986 0 00-4.236-.007 2.986 2.986 0 00.015 4.224.5.5 0 00.706-.03.5.5 0 00-.035-.7 1.985 1.985 0 01-.008-2.814 1.985 1.985 0 012.817-.004 1.985 1.985 0 01-.28 2.946 2.59 2.59 0 01-.3.261z" />
                <path d="M10.45 15.5c.34.15.619.339.835.57a.5.5 0 10.752-.66 3.026 3.026 0 00-1.213-.828.5.5 0 10-.374.918z" />
                <path d="M11.5 0C5.159 0 0 5.159 0 11.5c0 2.475.781 4.768 2.106 6.644l-1.045 3.103a.5.5 0 00.127.546.5.5 0 00.556.098l3.251-1.385A11.457 11.457 0 0011.5 23C17.841 23 23 17.841 23 11.5S17.841 0 11.5 0zm0 22c-3.032 0-5.875-1.183-8.01-3.333a.5.5 0 00-.526-.074l-2.249.959.679-2.015a.5.5 0 00-.062-.475A10.444 10.444 0 011 11.5C1 5.71 5.71 1 11.5 1S22 5.71 22 11.5 17.29 22 11.5 22z" />
              </svg>
              Place Order via WhatsApp
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutModal;
