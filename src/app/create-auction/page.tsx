"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Timer, DollarSign, X, Camera, Info } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImagePreview {
  url: string;
  file: File;
}

export default function CreateAuctionPage() {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Art",
    startingBid: "",
    duration: "24", // hours
    condition: "New",
    dimensions: "",
    material: "",
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length + images.length <= 5) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length + images.length <= 5) {
      const newImages = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
          url: URL.createObjectURL(file),
          file,
        }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const categories = [
    "Art",
    "Collectibles",
    "Electronics",
    "Fashion",
    "Jewelry",
    "Sports",
    "Antiques",
    "Luxury",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-purple-100">
          Create New Auction
        </h1>
        <Button
          onClick={() => setShowPreview(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Preview Listing
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <Card className="p-6 bg-gray-900/50 border-purple-900/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-purple-100">
              Item Images
            </h2>
            <span className="text-sm text-gray-400">
              {images.length}/5 images
            </span>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging
                ? "border-purple-500 bg-purple-500/10"
                : "border-purple-900"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={handleImageUpload}
              disabled={images.length >= 5}
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer flex flex-col items-center ${
                images.length >= 5 ? "opacity-50" : ""
              }`}
            >
              <Camera className="w-12 h-12 text-purple-400 mb-2" />
              <span className="text-purple-100">
                Drag & drop images or click to upload
              </span>
              <span className="text-gray-400 text-sm mt-1">
                Up to 5 high-quality images
              </span>
            </label>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <Image
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform group-hover:scale-110"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Item Details */}
        <Card className="p-6 bg-gray-900/50 border-purple-900/20">
          <h2 className="text-xl font-semibold text-purple-100 mb-4">
            Item Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-100 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Give your item a catchy title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-100 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                placeholder="Describe your item in detail - condition, history, unique features..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-100 mb-1">
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      condition: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {["New", "Like New", "Excellent", "Good", "Fair"].map(
                    (condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-1">
                  Starting Bid
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.startingBid}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startingBid: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-100 mb-1">
                  Duration
                </label>
                <div className="relative">
                  <Timer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {[
                      { value: "12", label: "12 hours" },
                      { value: "24", label: "1 day" },
                      { value: "48", label: "2 days" },
                      { value: "72", label: "3 days" },
                      { value: "168", label: "7 days" },
                    ].map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            className="border-purple-700 hover:bg-purple-900/50"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-8 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors"
          >
            Create Auction
          </motion.button>
        </div>
      </form>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowPreview(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 p-4"
            >
              <Card className="p-6 bg-gray-900/95 border-purple-500/20 backdrop-blur-lg shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-purple-100">
                    Preview Listing
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Preview Content */}
                <div className="space-y-4">
                  {images.length > 0 && (
                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <Image
                        src={images[0].url}
                        alt="Main preview"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-semibold text-purple-100">
                      {formData.title}
                    </h4>
                    <p className="text-gray-400 mt-2">{formData.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">Starting Bid</span>
                      <div className="text-xl font-bold text-purple-100">
                        ${parseFloat(formData.startingBid).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration</span>
                      <div className="text-xl font-bold text-purple-100">
                        {formData.duration} hours
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-purple-900/50">
                    <Button
                      variant="outline"
                      onClick={() => setShowPreview(false)}
                      className="border-purple-700 hover:bg-purple-900/50"
                    >
                      Edit Listing
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        // Here you would submit the form
                        alert("Auction created successfully!");
                        window.location.href = "/";
                      }}
                    >
                      Publish Auction
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
