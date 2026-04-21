"use client";

import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

export type Category = {
	id: number;
	name: string;
	description?: string | null;
	_count?: { products?: number } | null;
};

interface Props {
	categories: Category[];
	loading: boolean;
	onEdit: (category: Category) => void;
	onDelete: (category: Category) => void;
}

export default function CategoryTable({ categories, loading, onEdit, onDelete }: Props) {
	if (loading) {
		return (
			<div className="w-full rounded-lg border border-gray-200 bg-white p-6 text-center">
				<div className="text-sm text-gray-500">Loading categories...</div>
			</div>
		);
	}

	if (!categories || categories.length === 0) {
		return (
			<div className="w-full rounded-lg border border-gray-200 bg-white p-6 text-center">
				<div className="text-sm text-gray-500">No categories found.</div>
			</div>
		);
	}

	return (
		<>
			{/* Desktop / Tablet: table layout (sm and above) */}
			<div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200 bg-white">
				<table className="min-w-full table-auto">
					<thead className="bg-gray-50 text-left text-sm text-gray-600">
						<tr>
							<th className="px-4 py-3">Name</th>
							<th className="px-4 py-3">Description</th>
							<th className="px-4 py-3">Products</th>
							<th className="px-4 py-3">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100 text-sm text-gray-700">
						{categories.map((cat) => (
							<tr key={cat.id}>
								<td className="px-4 py-3 align-top">
									<div className="font-medium text-gray-900">{cat.name}</div>
								</td>
								<td className="px-4 py-3 align-top">
									<div className="text-sm text-gray-600">{cat.description ?? '-'}</div>
								</td>
								<td className="px-4 py-3 align-top">
									<div className="text-sm text-gray-700">{cat._count?.products ?? 0}</div>
								</td>
								<td className="px-4 py-3 align-top">
									<div className="flex items-center gap-2">
										<button
											onClick={() => onEdit(cat)}
											aria-label={`Edit ${cat.name}`}
											className="rounded-md p-2 text-gray-600 hover:bg-gray-50"
										>
											<Edit3 className="h-4 w-4" />
										</button>
										<button
											onClick={() => onDelete(cat)}
											aria-label={`Delete ${cat.name}`}
											className="rounded-md p-2 text-amber-400 hover:bg-amber-50"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Mobile: vertical card list */}
			<div className="sm:hidden space-y-3">
				{categories.map((cat) => (
					<div key={cat.id} className="rounded-lg border border-gray-200 bg-white p-2">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="text-sm font-medium text-gray-900">{cat.name}</div>
								<div className="mt-1 text-xs text-gray-600">{cat.description ?? '-'}</div>
								<div className="mt-2 text-xs text-gray-500">Products: {cat._count?.products ?? 0}</div>
							</div>
							<div className="ml-3 flex flex-col items-end gap-2">
								<button
									onClick={() => onEdit(cat)}
									aria-label={`Edit ${cat.name}`}
									className="inline-flex items-center justify-center rounded-md bg-gray-50 p-2 text-gray-700 hover:bg-gray-100"
								>
									<Edit3 className="h-4 w-4" />
								</button>
								<button
									onClick={() => onDelete(cat)}
									aria-label={`Delete ${cat.name}`}
									className="inline-flex items-center justify-center rounded-md bg-amber-50 p-2 text-amber-400 hover:bg-amber-100"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);

}


