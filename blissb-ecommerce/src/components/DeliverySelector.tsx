"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDeliveryStore, type DeliveryType } from "@/store/deliveryStore";
import { Calendar, Clock, AlertCircle, CheckCircle2, MapPin, Package, Truck, ShoppingBag } from "lucide-react";

const deliveryIcons = {
  shipping: Package,
  delivery: Truck,
  pickup: ShoppingBag,
};

interface DeliverySelectorProps {
  showConfirmation?: boolean;
  onConfirm?: () => void;
}

export function DeliverySelector({ showConfirmation = false, onConfirm }: DeliverySelectorProps) {
  const {
    selectedType,
    selectedDate,
    selectedTime,
    selectedZipCode,
    isConfirmed,
    setDeliveryType,
    setSelectedDate,
    setSelectedTime,
    setSelectedZipCode,
    confirmSelection,
    getAvailableDays,
    getTimeSlots,
    isValidSelection,
    getDeliveryOptions,
    getDeliveryFee,
    isZipCodeInFreeZone
  } = useDeliveryStore();

  const deliveryOptions = getDeliveryOptions();
  const availableDays = getAvailableDays(selectedType);
  const timeSlots = selectedDate ? getTimeSlots(selectedDate, selectedType) : [];

  const handleTypeChange = (type: DeliveryType) => {
    setDeliveryType(type);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleZipCodeChange = (zipCode: string) => {
    setSelectedZipCode(zipCode);
  };

  const handleConfirm = () => {
    confirmSelection();
    onConfirm?.();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSelectedOption = () => {
    const option = deliveryOptions.find(option => option.type === selectedType);
    if (!option) return null;

    // Para delivery, calcular fee basado en zip code
    if (option.type === 'delivery') {
      const dynamicFee = getDeliveryFee(selectedZipCode);
      return { ...option, fee: dynamicFee };
    }

    return option;
  };

  return (
    <div className="space-y-6">
      {/* Delivery Options */}
      <div>
        <h3 className="text-lg font-semibold text-[#8F4B2B] mb-4">
          Choose Your Delivery Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deliveryOptions.map((option) => {
            // Para delivery, mostrar fee dinámico basado en zip code
            let displayFee = option.fee;
            let feeLabel = displayFee && displayFee > 0 ? `$${displayFee}` : 'Free';

            if (option.type === 'delivery' && selectedZipCode) {
              displayFee = getDeliveryFee(selectedZipCode);
              feeLabel = displayFee > 0 ? `$${displayFee}` : 'Free';
            } else if (option.type === 'delivery' && !selectedZipCode) {
              feeLabel = 'Enter zip code';
            }

            const IconComponent = deliveryIcons[option.type];

            return (
              <Card
                key={option.type}
                className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                  selectedType === option.type
                    ? 'border-[#8F4B2B] bg-[#8F4B2B]/5'
                    : 'border-gray-200 hover:border-[#8F4B2B]/50'
                }`}
                onClick={() => handleTypeChange(option.type)}
              >
                <div className="text-center space-y-2">
                  <div className="flex justify-center">
                    <IconComponent
                      className={`w-10 h-10 ${
                        selectedType === option.type
                          ? 'text-[#8F4B2B]'
                          : 'text-[#6E5B4E]'
                      }`}
                    />
                  </div>
                  <h4 className="font-medium text-[#3B2A22]">{option.label}</h4>
                  <p className="text-sm text-[#6E5B4E]">{option.description}</p>
                  <p className="text-xs text-[#8F4B2B] font-medium">{option.estimatedTime}</p>
                  <Badge
                    variant="secondary"
                    className={
                      feeLabel === 'Free'
                        ? "bg-[#1E7A31] text-white"
                        : feeLabel === 'Enter zip code'
                        ? "bg-gray-200 text-gray-600"
                        : "bg-[#EFC596] text-[#8F4B2B]"
                    }
                  >
                    {feeLabel}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Zip Code Input for Delivery */}
      {selectedType === 'delivery' && (
        <div>
          <h3 className="text-lg font-semibold text-[#8F4B2B] mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Enter Your Zip Code
          </h3>
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="Enter your 5-digit zip code"
              value={selectedZipCode}
              onChange={(e) => handleZipCodeChange(e.target.value)}
              className="border-[#E6D7CB] focus:border-[#8F4B2B]"
              maxLength={5}
            />
            {selectedZipCode && selectedZipCode.length === 5 && (
              <div className="mt-2 text-sm">
                {isZipCodeInFreeZone(selectedZipCode) ? (
                  <div className="text-[#1E7A31] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Free delivery to your area!
                  </div>
                ) : (
                  <div className="text-[#8F4B2B] flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Delivery fee: $20 to your area
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date Selection for Delivery/Pickup */}
      {(selectedType === 'delivery' || selectedType === 'pickup') && (
        <div>
          <h3 className="text-lg font-semibold text-[#8F4B2B] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Date
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableDays.map((day) => (
              <Button
                key={day.date}
                variant={selectedDate === day.date ? "default" : "outline"}
                className={`p-3 h-auto text-left ${
                  selectedDate === day.date
                    ? 'bg-[#8F4B2B] text-white'
                    : 'border-gray-200 hover:border-[#8F4B2B]'
                }`}
                onClick={() => handleDateSelect(day.date)}
              >
                <div>
                  <div className="font-medium text-sm">{day.dayName}</div>
                  <div className="text-xs opacity-80">
                    {formatDate(day.date).split(', ')[1]}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Time Selection */}
      {selectedDate && (selectedType === 'delivery' || selectedType === 'pickup') && (
        <div>
          <h3 className="text-lg font-semibold text-[#8F4B2B] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Select Time
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                className={`p-4 h-auto ${
                  selectedTime === slot.time
                    ? 'bg-[#8F4B2B] text-white'
                    : slot.available
                    ? 'border-gray-200 hover:border-[#8F4B2B]'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => slot.available && handleTimeSelect(slot.time)}
                disabled={!slot.available}
              >
                <div className="text-center w-full">
                  <div className="font-medium">{slot.time}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Validation Warning */}
      {(selectedType === 'delivery' || selectedType === 'pickup') && !isValidSelection() && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-start gap-3 text-orange-800">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Selection Required</h4>
              <p className="text-sm">
                {selectedType === 'delivery'
                  ? 'Please enter your zip code and select both a date and time for delivery to continue.'
                  : 'Please select both a date and time for pickup to continue.'
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Confirmation Section */}
      {showConfirmation && isValidSelection() && (
        <Card className="p-6 border-[#8F4B2B] bg-[#8F4B2B]/5">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#8F4B2B] flex items-center gap-2">
              {isConfirmed ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              Confirm Your Selection
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6E5B4E]">Delivery Method:</span>
                <span className="font-medium text-[#3B2A22]">
                  {getSelectedOption()?.label}
                </span>
              </div>

              {selectedType === 'delivery' && selectedZipCode && (
                <div className="flex justify-between">
                  <span className="text-[#6E5B4E]">Zip Code:</span>
                  <span className="font-medium text-[#3B2A22]">{selectedZipCode}</span>
                </div>
              )}

              {selectedDate && (
                <div className="flex justify-between">
                  <span className="text-[#6E5B4E]">Date:</span>
                  <span className="font-medium text-[#3B2A22]">
                    {formatDate(selectedDate)}
                  </span>
                </div>
              )}

              {selectedTime && (
                <div className="flex justify-between">
                  <span className="text-[#6E5B4E]">Time:</span>
                  <span className="font-medium text-[#3B2A22]">{selectedTime}</span>
                </div>
              )}

              {getSelectedOption()?.fee && getSelectedOption()!.fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#6E5B4E]">Delivery Fee:</span>
                  <span className="font-medium text-[#3B2A22]">
                    ${getSelectedOption()!.fee}
                  </span>
                </div>
              )}
            </div>

            {!isConfirmed && (
              <Button
                onClick={handleConfirm}
                className="w-full bg-[#8F4B2B] hover:bg-[#6f3a22] text-white"
                disabled={!isValidSelection()}
              >
                Confirm Selection
              </Button>
            )}

            {isConfirmed && (
              <div className="text-center">
                <Badge className="bg-[#1E7A31] text-white flex items-center gap-1 justify-center w-fit mx-auto">
                  <CheckCircle2 className="w-4 h-4" />
                  Selection Confirmed
                </Badge>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}