
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/api/clients';
import { useToast } from '@/Components/Toast/toast';
import { TfiReload } from "react-icons/tfi";

const settingsSchema = z.object({
    topic: z.string().min(1, 'Topic is required'),
    callNumber: z.string().min(1, 'Call number is required'),
    discountPercentage: z.string().min(1, 'Discount percentage is required'),
    isActive: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
    const { showSuccess, showError } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            topic: '',
            callNumber: '',
            discountPercentage: '',
            isActive: true,
        },
    });

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/settings');
            if (response.status === 200 && response.data) {
                const { topic, callNumber, discountPercentage, isActive } = response.data;
                setValue('topic', topic);
                setValue('callNumber', callNumber);
                setValue('discountPercentage', discountPercentage);
                setValue('isActive', isActive);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            showError('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    }, [setValue, showError]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const onSubmit = async (data: SettingsFormData) => {
        try {
            const response = await apiClient.put('/settings', data);
            if (response.status === 200) {
                showSuccess('Settings updated successfully', {
                    description: 'Top bar settings have been updated.',
                    duration: 4000,
                    icon: '⚙️',
                });
                // Refresh local state with response if needed, for now just stay put
            }
        } catch (error: any) {
            console.error('Error updating settings:', error);
            showError('Failed to update settings', {
                description: error.message || 'Please try again later.',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-2">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage global store configurations</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="p-5 border-b border-gray-100">
                            <h2 className="text-base font-semibold text-gray-900">Top Bar Configuration</h2>
                            <p className="text-xs text-gray-500 mt-1">Customize the announcement bar at the top of the site</p>
                        </div>

                        <div className="p-5 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                                        Topic / Announcement
                                    </label>
                                    <input
                                        type="text"
                                        id="topic"
                                        {...register('topic')}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        placeholder="e.g. University of Ghana this is your plug"
                                    />
                                    {errors.topic && (
                                        <p className="mt-1 text-sm text-amber-700">{errors.topic.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="callNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        Call Number
                                    </label>
                                    <input
                                        type="text"
                                        id="callNumber"
                                        {...register('callNumber')}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        placeholder="e.g. +233 55 555 5555"
                                    />
                                    {errors.callNumber && (
                                        <p className="mt-1 text-sm text-amber-700">{errors.callNumber.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                                        Discount / Tagline
                                    </label>
                                    <input
                                        type="text"
                                        id="discountPercentage"
                                        {...register('discountPercentage')}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        placeholder="e.g. Instant deliveries!"
                                    />
                                    {errors.discountPercentage && (
                                        <p className="mt-1 text-sm text-amber-700">{errors.discountPercentage.message}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register('isActive')}
                                            className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Show Top Bar</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-white border border-gray-200 bg-white rounded-lg transition-all shadow-sm"
                                title="Refresh"
                                onClick={() => fetchSettings()}
                            >
                                <TfiReload className="w-5 h-5" />
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
