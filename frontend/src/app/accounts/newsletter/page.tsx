"use client";

import React, { useEffect, useState } from 'react';
import { newsletterService, NewsletterCampaign } from './lib/newsletterService';
import NewsletterBuilder from './Components/NewsletterBuilder';
import { Plus, Mail, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterPage() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<NewsletterCampaign | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const data = await newsletterService.fetchCampaigns();
      setCampaigns(data);
    } catch (e: any) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async () => {
    try {
      const newCampaign = await newsletterService.createCampaign({
        title: 'New Campaign',
        subject: 'Exciting News!',
        content: { blocks: [{ id: 'block_' + Date.now(), type: 'hero', props: { title: 'Welcome', subtitle: 'Our latest update' } }] }
      });
      setCampaigns([newCampaign, ...campaigns]);
      setSelectedCampaign(newCampaign);
      toast.success('Draft started!');
    } catch (e: any) {
      toast.error('Could not create campaign');
    }
  };

  if (loading) return <div className="p-8">Loading newsletters...</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8  min-h-screen font-sans">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">Newsletter Manager</h1>
          <p className="text-gray-600 mt-1">Build and broadcast JSON-powered emails.</p>
        </div>
        {!selectedCampaign && (
            <button 
              onClick={handleCreate}
              className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md text-sm"
            >
              <Plus size={16} strokeWidth={2.5} /> Create Campaign
            </button>
        )}
        {selectedCampaign && (
            <button 
              onClick={() => setSelectedCampaign(null)}
              className="bg-white border border-gray-200 text-[#222222] px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm text-sm"
            >
              Back to List
            </button>
        )}
      </div>

      {!selectedCampaign ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {campaigns.map(camp => (
            <div 
              key={camp.id} 
              onClick={() => setSelectedCampaign(camp)}
              className="bg-[#FFFFFF] p-4 rounded-xl border border-gray-100 shadow-sm hover:border-[#D4AF37] cursor-pointer transition-all hover:shadow-lg group flex flex-col gap-3"
            >
               <div className="flex justify-between items-start">
                 <h3 className="font-bold text-lg text-[#222222] line-clamp-1">{camp.title}</h3>
                 {camp.status === 'sent' ? <CheckCircle size={20} className="text-green-500" /> : 
                  camp.status === 'scheduled' ? <Clock size={20} className="text-orange-500" /> :
                  <Mail size={20} className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" />}
               </div>
               <p className="text-sm text-gray-600 truncate">{camp.subject}</p>
               <div className="flex justify-between items-center mt-1 pt-3 border-t border-gray-50">
                   <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${camp.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                       {camp.status}
                   </span>
                   <span className="text-sm font-medium text-gray-400">{new Date(camp.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
          ))}
          {campaigns.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                  <Mail size={48} className="mb-4 text-gray-300" />
                  <p>No campaigns found. Start your first draft!</p>
              </div>
          )}
        </div>
      ) : (
        <NewsletterBuilder 
          campaign={selectedCampaign} 
          onUpdated={() => {
              fetchCampaigns();
          }} 
        />
      )}
    </div>
  );
}
