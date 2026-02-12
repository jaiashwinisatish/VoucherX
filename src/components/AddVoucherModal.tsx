import { useState, FormEvent } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AddVoucherModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface FormData {
    brandName: string;
    category: string;
    originalValue: string;
    sellingPrice: string;
    expiryDate: string;
    voucherCode: string;
    description: string;
}

interface FormErrors {
    brandName?: string;
    category?: string;
    originalValue?: string;
    sellingPrice?: string;
    expiryDate?: string;
    voucherCode?: string;
}

const CATEGORIES = [
    { value: '', label: 'Select a category' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'fashion', label: 'Fashion & Apparel' },
    { value: 'travel', label: 'Travel & Transport' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'tech', label: 'Technology' },
    { value: 'health', label: 'Health & Wellness' },
];

export default function AddVoucherModal({ isOpen, onClose, onSuccess }: AddVoucherModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState<FormData>({
        brandName: '',
        category: '',
        originalValue: '',
        sellingPrice: '',
        expiryDate: '',
        voucherCode: '',
        description: '',
    });

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (formErrors[field as keyof FormErrors]) {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        // Brand name validation
        if (!formData.brandName.trim()) {
            errors.brandName = 'Brand name is required';
        } else if (formData.brandName.length > 100) {
            errors.brandName = 'Brand name must be less than 100 characters';
        }

        // Category validation
        if (!formData.category) {
            errors.category = 'Please select a category';
        }

        // Original value validation
        const originalValue = parseFloat(formData.originalValue);
        if (!formData.originalValue || isNaN(originalValue) || originalValue <= 0) {
            errors.originalValue = 'Original value must be greater than $0';
        } else if (originalValue > 10000) {
            errors.originalValue = 'Original value cannot exceed $10,000';
        }

        // Selling price validation
        const sellingPrice = parseFloat(formData.sellingPrice);
        if (!formData.sellingPrice || isNaN(sellingPrice) || sellingPrice <= 0) {
            errors.sellingPrice = 'Selling price must be greater than $0';
        } else if (sellingPrice > originalValue) {
            errors.sellingPrice = 'Selling price cannot exceed original value';
        }

        // Expiry date validation
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiryDate = new Date(formData.expiryDate);

        if (!formData.expiryDate) {
            errors.expiryDate = 'Expiry date is required';
        } else if (expiryDate <= today) {
            errors.expiryDate = 'Expiry date must be in the future';
        }

        // Voucher code validation
        if (!formData.voucherCode.trim()) {
            errors.voucherCode = 'Voucher code is required';
        } else if (formData.voucherCode.length > 50) {
            errors.voucherCode = 'Voucher code must be less than 50 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in to add a voucher');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: insertError } = await supabase
                .from('vouchers')
                .insert({
                    seller_id: user.id,
                    brand_name: formData.brandName,
                    category: formData.category,
                    original_value: parseFloat(formData.originalValue),
                    selling_price: parseFloat(formData.sellingPrice),
                    voucher_code: formData.voucherCode,
                    expiry_date: formData.expiryDate,
                    description: formData.description || null,
                    status: 'pending_verification',
                    is_verified: false,
                    views: 0,
                })
                .select()
                .single();

            if (insertError) throw insertError;

            // Reset form
            setFormData({
                brandName: '',
                category: '',
                originalValue: '',
                sellingPrice: '',
                expiryDate: '',
                voucherCode: '',
                description: '',
            });

            // Call success callback
            onSuccess?.();
            onClose();

            // Show success message
            alert('Voucher added successfully! It will appear after verification.');
        } catch (error: any) {
            console.error('Error adding voucher:', error);
            setError(error.message || 'Failed to add voucher. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateDiscount = () => {
        const original = parseFloat(formData.originalValue);
        const selling = parseFloat(formData.sellingPrice);
        if (original > 0 && selling > 0 && selling <= original) {
            return (((original - selling) / original) * 100).toFixed(2);
        }
        return '0.00';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-blue-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Plus className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-bold">Add New Voucher</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Brand Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Brand Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.brandName}
                            onChange={(e) => handleInputChange('brandName', e.target.value)}
                            placeholder="e.g., Amazon, Starbucks, Nike"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${formErrors.brandName ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                }`}
                        />
                        {formErrors.brandName && (
                            <p className="text-sm text-red-600 mt-1">{formErrors.brandName}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${formErrors.category ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                }`}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        {formErrors.category && (
                            <p className="text-sm text-red-600 mt-1">{formErrors.category}</p>
                        )}
                    </div>

                    {/* Original Value & Selling Price */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Original Value <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="10000"
                                    value={formData.originalValue}
                                    onChange={(e) => handleInputChange('originalValue', e.target.value)}
                                    placeholder="100.00"
                                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${formErrors.originalValue ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                        }`}
                                />
                            </div>
                            {formErrors.originalValue && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.originalValue}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Selling Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.sellingPrice}
                                    onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                                    placeholder="80.00"
                                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${formErrors.sellingPrice ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                        }`}
                                />
                            </div>
                            {formErrors.sellingPrice && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.sellingPrice}</p>
                            )}
                        </div>
                    </div>

                    {/* Discount Display */}
                    {formData.originalValue && formData.sellingPrice && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700">Discount Percentage</span>
                                <span className="text-2xl font-bold text-emerald-600">{calculateDiscount()}% OFF</span>
                            </div>
                        </div>
                    )}

                    {/* Expiry Date & Voucher Code */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${formErrors.expiryDate ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                    }`}
                            />
                            {formErrors.expiryDate && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.expiryDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Voucher Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.voucherCode}
                                onChange={(e) => handleInputChange('voucherCode', e.target.value)}
                                placeholder="e.g., AMZ-XXXX-1234"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-mono ${formErrors.voucherCode ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                    }`}
                            />
                            {formErrors.voucherCode && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.voucherCode}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description <span className="text-slate-400">(Optional)</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Add details about where and how to use this voucher..."
                            rows={3}
                            maxLength={500}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {formData.description.length}/500 characters
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5" />
                                    <span>Add Voucher</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
