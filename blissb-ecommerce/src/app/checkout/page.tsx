"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, AlertCircle, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalPrice,
    getMinimumCookiesInfo 
  } = useCartStore();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    country: 'United States',
    sendNews: false,
    sameBilling: true,
    cardNumber: '',
    expiration: '',
    securityCode: '',
    orderNote: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);

  const cookiesInfo = getMinimumCookiesInfo();
  const subtotal = getTotalPrice();
  const total = subtotal; // Add shipping, taxes, discounts later

  // Redirect if cart is empty or doesn't meet requirements
  useEffect(() => {
    if (items.length === 0 || !cookiesInfo.hasEnoughCookies) {
      router.push('/');
    }
  }, [items.length, cookiesInfo.hasEnoughCookies, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here will integrate with Stripe later
    alert('Order placed successfully! (Demo mode)');
  };

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-[#F8F4F0]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-[#3B2A22]">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#8F4B2B]">Contact information</h2>
                  <button type="button" className="text-sm text-[#8F4B2B] hover:underline">
                    Sign in
                  </button>
                </div>
                <p className="text-sm text-[#6E5B4E] mb-4">
                  We'll use this email to send you details and updates about your order.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Email address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="news"
                      checked={formData.sendNews}
                      onCheckedChange={(checked) => handleInputChange('sendNews', checked)}
                    />
                    <Label htmlFor="news" className="text-sm text-[#6E5B4E]">
                      Send me news and offers by email
                    </Label>
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-[#8F4B2B] mb-2">Shipping address</h2>
                <p className="text-sm text-[#6E5B4E] mb-4">
                  Enter the address where you want your order delivered.
                </p>

                <div className="space-y-4">
                  <Input
                    placeholder="Country/Region"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                      required
                    />
                    <Input
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                      required
                    />
                  </div>

                  <Input
                    placeholder="Company (optional)"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                  />

                  <Input
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                    required
                  />

                  <button 
                    type="button"
                    className="text-sm text-[#8F4B2B] hover:underline flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Add apartment, suite, etc.
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                      required
                    />
                    <Input
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                      required
                    />
                    <Input
                      placeholder="Phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="billing"
                      checked={formData.sameBilling}
                      onCheckedChange={(checked) => handleInputChange('sameBilling', checked)}
                    />
                    <Label htmlFor="billing" className="text-sm text-[#6E5B4E]">
                      Use same address for billing
                    </Label>
                  </div>
                </div>
              </Card>

              {/* Payment Options */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-[#8F4B2B] mb-2">Payment options</h2>
                <p className="text-sm text-[#6E5B4E] mb-4">
                  All transactions are secure and encrypted.
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Card number"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B] md:col-span-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Expiration"
                        value={formData.expiration}
                        onChange={(e) => handleInputChange('expiration', e.target.value)}
                        className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                      />
                      <Input
                        placeholder="Security code"
                        value={formData.securityCode}
                        onChange={(e) => handleInputChange('securityCode', e.target.value)}
                        className="rounded-full border-[#E6D7CB] focus:border-[#8F4B2B]"
                      />
                    </div>
                  </div>

                  <button 
                    type="button"
                    className="text-sm text-[#8F4B2B] hover:underline flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Add a note to your order
                  </button>
                </div>
              </Card>

              <div className="text-xs text-[#6E5B4E] text-center">
                By proceeding with your purchase you agree to our Terms and Conditions and Privacy Policy
              </div>

              <Button 
                type="submit"
                className="w-full bg-[#1E7A31] hover:bg-[#166426] text-white font-medium py-4 text-lg rounded-full"
                size="lg"
              >
                Place order
              </Button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:pl-8">
            <Card className="bg-[#8F4B2B] text-white p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Order summary</h2>
                <div className="flex items-center gap-1 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Our cookies may contain nuts, gluten, dairy, and soy</span>
                </div>
              </div>

              {/* Products */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-[#1E7A31] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">{item.product.name}</h3>
                      <p className="text-sm text-white/80 mb-2">Descripción del producto</p>
                      <p className="text-xl font-bold">${(item.product.price * item.quantity).toFixed(0)}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-white/80 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center bg-white/20 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white/20 rounded-full"
                          disabled={item.quantity <= (item.product.category === 'cookies' ? 4 : 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white/20 rounded-full"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Coupons */}
              <div className="mb-6">
                <button
                  onClick={() => setShowCoupon(!showCoupon)}
                  className="flex items-center justify-between w-full text-left font-medium mb-2"
                >
                  Add coupons
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCoupon ? 'rotate-180' : ''}`} />
                </button>
                
                {showCoupon && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                    <Button 
                      type="button"
                      className="bg-white text-[#8F4B2B] hover:bg-white/90"
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              <Separator className="my-4 bg-white/20" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal • {items.length} items</span>
                  <span className="font-semibold">${subtotal.toFixed(0)}</span>
                </div>
                <div className="text-sm text-white/80">
                  Shipping cost (free when choosing in-store pickup)
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-white/20">
                  <span>Total</span>
                  <span>${total.toFixed(0)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}