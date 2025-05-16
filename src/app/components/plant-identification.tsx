"use client";

import { useEffect, useState } from "react";
import { Droplet, Leaf, RefreshCw, Sun, Wind } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { identifyPlant } from "../../../actions/plant-actions";
import Button from "./ui/Button";

interface PlantIdentificationProps {
    imageUrl: string;
    onReset: () => void;
}

interface PlantInfo {
    name: string;
    scientificName: string;
    description: string;
    careInstructions: {
        water: string;
        light: string;
        soil: string;
        temperature: string;
    };
    healthAssessment: {
        status: "healthy" | "moderate" | "unhealthy";
        issues: string[];
        recommendations: string[];
    };
}

export function PlantIdentificationSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function PlantIdentification(
    { imageUrl, onReset }: PlantIdentificationProps,
) {
    const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getPlantIdentification = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const result = await identifyPlant(imageUrl);
                if (result.success) {
                    setPlantInfo(result.data);
                } else {
                    setError(result.error || "Failed to identify plant");
                }
            } catch (err) {
                setError("An error occurred during plant identification");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        getPlantIdentification();
    }, [imageUrl]);

    if (isLoading) {
        return <PlantIdentificationSkeleton />;
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <p className="text-red-600 dark:text-red-400">
                            {error}
                        </p>
                        <Button onClick={onReset}>
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!plantInfo) return null;

    const healthStatusColor = {
        healthy:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        moderate:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        unhealthy: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">
                                {plantInfo.name}
                            </CardTitle>
                            <CardDescription className="italic">
                                {plantInfo.scientificName}
                            </CardDescription>
                        </div>
                        <Badge
                            className={healthStatusColor[
                                plantInfo.healthAssessment.status
                            ]}
                        >
                            {plantInfo.healthAssessment.status === "healthy"
                                ? "Healthy"
                                : plantInfo.healthAssessment.status ===
                                        "moderate"
                                ? "Needs Attention"
                                : "Unhealthy"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-4 flex-col md:flex-row">
                        <div className="md:w-1/3">
                            <img
                                src={imageUrl || "/placeholder.svg"}
                                alt={plantInfo.name}
                                className="rounded-lg w-full h-auto object-cover"
                            />
                        </div>
                        <div className="md:w-2/3">
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                {plantInfo.description}
                            </p>

                            <Tabs defaultValue="care">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="care">
                                        Care Guide
                                    </TabsTrigger>
                                    <TabsTrigger value="health">
                                        Health Assessment
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="care"
                                    className="space-y-4 pt-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                                                <Droplet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    Water
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {plantInfo.careInstructions
                                                        .water}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                                                <Sun className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    Light
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {plantInfo.careInstructions
                                                        .light}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div className="bg-brown-100 dark:bg-amber-900 p-2 rounded-full">
                                                <Leaf className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    Soil
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {plantInfo.careInstructions
                                                        .soil}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                                                <Wind className="h-5 w-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    Temperature
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {plantInfo.careInstructions
                                                        .temperature}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value="health"
                                    className="space-y-4 pt-4"
                                >
                                    {plantInfo.healthAssessment.issues.length >
                                            0
                                        ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium mb-2">
                                                        Identified Issues:
                                                    </h4>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {plantInfo
                                                            .healthAssessment
                                                            .issues.map((
                                                                issue,
                                                                index,
                                                            ) => (
                                                                <li
                                                                    key={index}
                                                                    className="text-gray-700 dark:text-gray-300"
                                                                >
                                                                    {issue}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium mb-2">
                                                        Recommendations:
                                                    </h4>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {plantInfo
                                                            .healthAssessment
                                                            .recommendations
                                                            .map((
                                                                rec,
                                                                index,
                                                            ) => (
                                                                <li
                                                                    key={index}
                                                                    className="text-gray-700 dark:text-gray-300"
                                                                >
                                                                    {rec}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )
                                        : (
                                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                                <p className="text-green-700 dark:text-green-300">
                                                    Your plant appears to be
                                                    healthy! Continue with the
                                                    recommended care routine.
                                                </p>
                                            </div>
                                        )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={onReset}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Analyze Another Plant
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
