"use client";

import type React from "react";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import Button from "./ui/Button";

import PlantIdentification from "./plant-identification";

export default function PlantUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(
        undefined,
    );
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Check file type
        const fileType = selectedFile.type;
        if (!fileType.startsWith("image/") && !fileType.startsWith("video/")) {
            setError("Please upload an image or video file");
            return;
        }

        // Check file size (limit to 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError("File size should be less than 10MB");
            return;
        }

        setFile(selectedFile);
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setIsUploading(true);
            setError(null);

            const result = await uploadPlantMedia(file);
            if (result.success) {
                setUploadedUrl(result.url);
            } else {
                setError(result.error || "Failed to upload file");
            }
        } catch (err) {
            setError("An error occurred during upload");
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const resetUpload = () => {
        setFile(null);
        setPreview(null);
        setUploadedUrl(undefined);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-8">
            {!uploadedUrl
                ? (
                    <Card className="border-dashed border-2 hover:border-green-500 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                {preview
                                    ? (
                                        <div className="relative w-full">
                                            <button
                                                onClick={resetUpload}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                                aria-label="Remove file"
                                            >
                                                <X size={16} />
                                            </button>
                                            {file?.type.startsWith("image/")
                                                ? (
                                                    <img
                                                        src={preview ||
                                                            "/placeholder.svg"}
                                                        alt="Plant preview"
                                                        className="max-h-96 mx-auto rounded-lg object-contain"
                                                    />
                                                )
                                                : (
                                                    <video
                                                        src={preview}
                                                        controls
                                                        className="max-h-96 w-full rounded-lg"
                                                    />
                                                )}
                                        </div>
                                    )
                                    : (
                                        <>
                                            <div className="p-4 bg-green-100 dark:bg-green-800 rounded-full">
                                                <Upload className="h-10 w-10 text-green-600 dark:text-green-300" />
                                            </div>
                                            <p className="text-center text-gray-600 dark:text-gray-300">
                                                Drag and drop your plant photo
                                                or video here, or click to
                                                browse
                                            </p>
                                        </>
                                    )}

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*,video/*"
                                    className="hidden"
                                    id="plant-file-upload"
                                />

                                {!preview
                                    ? (
                                        <Button
                                            onClick={() =>
                                                fileInputRef.current?.click()}
                                            className="border-green-500 text-green-700 dark:text-green-300"
                                        >
                                            Select File
                                        </Button>
                                    )
                                    : (
                                        <Button
                                            onClick={handleUpload}
                                            disabled={isUploading}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            {isUploading
                                                ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Uploading...
                                                    </>
                                                )
                                                : (
                                                    "Analyze Plant"
                                                )}
                                        </Button>
                                    )}

                                {error && (
                                    <p className="text-red-500 text-sm">
                                        {error}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )
                : (
                    <PlantIdentification
                        imageUrl={uploadedUrl}
                        onReset={resetUpload}
                    />
                )}
        </div>
    );
}
