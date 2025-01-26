"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Camera, DollarSign, Timer, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createNewAuction, uploadImage } from "@/lib/supabase";
import { auth } from "@/firebase";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
        toast.error("Please login to create an auction", {
          position: "bottom-right",
        });
      }
    });

    return () => unsubscribe();
  }, [router]);

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
    
    if (!auth.currentUser) {
      router.push('/login');
      return;
    }

    if (!formData.title || !formData.description || !formData.startingBid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image if exists
      let imageUrl = '/placeholder.jpg';
      if (images.length > 0) {
        try {
          imageUrl = await uploadImage(images[0].file);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }
      }

      // Create the auction
      await createNewAuction({
        title: formData.title,
        description: formData.description,
        starting_bid: parseFloat(formData.startingBid),
        duration: formData.duration,
        category: formData.category,
        condition: formData.condition,
        dimensions: formData.dimensions,
        material: formData.material,
        image_url: imageUrl
      });

      router.push("/");
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-purple-100">Create New Auction</h1>

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

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square rounded-lg overflow-hidden group bg-gray-700"
                >
                  <Image
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
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

        {/* Item Details Section */}
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
                className="w-full px-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:ring-2 focus:ring-purple-500 h-32"
                required
              />
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
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:ring-2 focus:ring-purple-500"
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
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:ring-2 focus:ring-purple-500"
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
            <div>
              <label className="block text-sm font-medium text-purple-100 mb-1">
                Dimensions
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dimensions: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., W: 120cm, H: 60cm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-100 mb-1">
                Material
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    material: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Mahogany, Leather"
                required
              />
            </div>
          </div>
        </Card>

        {/* Preview Section */}
        <div>
          <Button
            type="button"
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Hide Preview" : "Preview Listing"}
          </Button>

          {showPreview && (
            <Card className="p-6 bg-gray-900/70 border-purple-900/20 mt-4">
              <h2 className="text-xl font-semibold text-purple-100 mb-4">
                Listing Preview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                  {images.length > 0 ? (
                    <Image
                      src={images[0].url}
                      alt="Preview Image"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No Image Uploaded
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-purple-100">
                    {formData.title || "Untitled Auction"}
                  </h3>
                  <p className="text-gray-400">
                    {formData.description || "No description provided."}
                  </p>
                  <div className="text-purple-100">
                    <p>Category: {formData.category}</p>
                    <p>Condition: {formData.condition}</p>
                    <p>Starting Bid: ${formData.startingBid || "0.00"}</p>
                    <p>Duration: {formData.duration} hours</p>
                    <p>Dimensions: {formData.dimensions || "N/A"}</p>
                    <p>Material: {formData.material || "N/A"}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            disabled={isSubmitting}
            className="px-8 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <span className="loader"></span>
                <span>Creating...</span>
              </span>
            ) : (
              "Create Auction"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}