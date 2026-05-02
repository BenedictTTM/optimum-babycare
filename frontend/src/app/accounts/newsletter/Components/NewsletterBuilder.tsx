import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Send, GripVertical } from 'lucide-react';
import { newsletterService } from '../lib/newsletterService';
import { toast } from 'sonner';
import { renderNewsletterHTML } from '../lib/frontendRenderer';

const BLOCK_REGISTRY: Record<string, { label: string; defaultProps: any; fields: { name: string; label: string; placeholder?: string }[] }> = {
  hero: {
    label: 'Hero',
    defaultProps: { title: 'New Hero', subtitle: 'Subtitle', image: '' },
    fields: [
      { name: 'title', label: 'Title', placeholder: 'Enter title' },
      { name: 'subtitle', label: 'Subtitle', placeholder: 'Enter subtitle' },
      { name: 'image', label: 'Image URL', placeholder: 'https://...' },
    ]
  },
  cta: {
    label: 'Call to Action',
    defaultProps: { text: 'Click Here', link: 'https://' },
    fields: [
      { name: 'text', label: 'Button Text', placeholder: 'Click Here' },
      { name: 'link', label: 'URL Link', placeholder: 'https://...' },
    ]
  },
  text: {
    label: 'Text',
    defaultProps: { content: 'Your text goes here' },
    fields: [
      { name: 'content', label: 'Content', placeholder: 'Paragraph text...' },
    ]
  },
  meal_list: {
    label: 'Meal List',
    defaultProps: { items: [] },
    fields: [] // Special handling for array fields
  }
};

export default function NewsletterBuilder({ campaign, onUpdated }: { campaign: any, onUpdated: () => void }) {
  const [blocks, setBlocks] = useState<any[]>(campaign.content?.blocks || []);
  const [title, setTitle] = useState(campaign.title);
  const [subject, setSubject] = useState(campaign.subject);
  const [loading, setLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  // Debounced preview update
  useEffect(() => {
    const handler = setTimeout(() => {
      setPreviewHtml(renderNewsletterHTML(blocks));
    }, 300);
    return () => clearTimeout(handler);
  }, [blocks]);

  const addBlock = (type: string) => {
    const registryEntry = BLOCK_REGISTRY[type];
    if (!registryEntry) return;

    const newBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      props: { ...registryEntry.defaultProps }
    };

    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, newProps: any) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, props: { ...block.props, ...newProps } } : block));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await newsletterService.updateCampaign(campaign.id, { title, subject, content: { blocks } });
      toast.success('Campaign saved successfully!');
      onUpdated();
    } catch (e: any) {
      toast.error(e.message || 'Error saving campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (confirm('Are you sure you want to broadcast this campaign to ALL subscribers?')) {
      setLoading(true);
      try {
        await newsletterService.sendCampaign(campaign.id);
        toast.success('Campaign sent successfully!');
        onUpdated();
      } catch (e: any) {
        toast.error(e.message || 'Error sending campaign');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col lg:flex-row gap-4">
      {/* Editor Panel */}
      <div className="w-full lg:w-1/2 flex flex-col gap-3 overflow-y-auto pr-2 pb-3">
        <div className="p-4 bg-[#FFFFFF]   flex justify-between items-center  top-0 z-10">
            <h2 className="text-xl font-bold">Builder</h2>
            <div className="flex gap-2">
                <button disabled={loading} onClick={handleSave} className="flex items-center gap-1 bg-[#222222] text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-semibold transition-colors shadow-sm">
                    <Save size={16} strokeWidth={2.5} /> Save
                </button>
                <button disabled={loading} onClick={handleSend} className="flex items-center gap-1 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-semibold transition-colors shadow-sm">
                    <Send size={16} strokeWidth={2.5} /> Send Email
                </button>
            </div>
        </div>

        <div className="p-3 bg-[#FFFFFF] rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <div>
            <label className="text-[11px] font-bold text-[#222222] uppercase mb-1 block tracking-wider">Campaign Title (Internal)</label>
            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. May Update"
              className="w-full p-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all shadow-sm text-[#222222] text-sm"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#222222] uppercase mb-1 block tracking-wider">Email Subject Line</label>
            <input
              value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Exciting News from Optimum!"
              className="w-full p-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all shadow-sm text-[#222222] text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {blocks.map((block) => {
            const registry = BLOCK_REGISTRY[block.type];
            if (!registry) return null;

            return (
              <div key={block.id} className="p-3 bg-[#FFFFFF] rounded-xl shadow-sm border border-gray-200 relative group transition-all hover:border-[#D4AF37]">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <GripVertical size={18} className="text-gray-300 cursor-grab active:cursor-grabbing" />
                    <h3 className="font-bold text-[#222222]">{registry.label} Block</h3>
                  </div>
                  <button 
                    onClick={() => removeBlock(block.id)}
                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Dynamic Fields rendering */}
                {registry.fields.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {registry.fields.map(field => (
                      <div key={field.name}>
                        <label className="text-[11px] font-semibold text-[#222222] mb-1 block uppercase tracking-wide">{field.label}</label>
                        {field.name === 'content' ? (
                           <textarea
                             value={block.props[field.name] || ''} 
                             onChange={(e) => updateBlock(block.id, { [field.name]: e.target.value })}
                             placeholder={field.placeholder} 
                             className="w-full p-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none text-[#222222]"
                             rows={2}
                           />
                        ) : (
                           <input
                             value={block.props[field.name] || ''} 
                             onChange={(e) => updateBlock(block.id, { [field.name]: e.target.value })}
                             placeholder={field.placeholder} 
                             className="w-full p-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none text-[#222222]"
                           />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Special Case: Meal List Array */}
                {block.type === 'meal_list' && (
                  <div className="flex flex-col gap-2 mt-2">
                      {block.props.items?.map((item: any, iIndex: number) => (
                          <div key={iIndex} className="p-2 bg-[#F2F2F2] border border-gray-200 rounded-lg flex flex-col gap-1.5 relative group/item">
                              <button 
                                  onClick={() => {
                                      const newItems = [...block.props.items];
                                      newItems.splice(iIndex, 1);
                                      updateBlock(block.id, { items: newItems });
                                  }}
                                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                              ><Trash2 size={14}/></button>
                              <div className="flex gap-2">
                                <input value={item.name} onChange={(e) => {
                                    const newItems = [...block.props.items]; newItems[iIndex].name = e.target.value; updateBlock(block.id, {items: newItems});
                                }} placeholder="Meal Name" className="flex-1 p-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-[#D4AF37] text-[#222222]" />
                                <input value={item.price} onChange={(e) => {
                                    const newItems = [...block.props.items]; newItems[iIndex].price = e.target.value; updateBlock(block.id, {items: newItems});
                                }} placeholder="Price" className="w-20 p-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-[#D4AF37] text-[#222222]" />
                              </div>
                              <input value={item.image} onChange={(e) => {
                                  const newItems = [...block.props.items]; newItems[iIndex].image = e.target.value; updateBlock(block.id, {items: newItems});
                              }} placeholder="Image URL" className="w-full p-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-[#D4AF37] text-[#222222]" />
                          </div>
                      ))}
                      <button 
                          onClick={() => {
                              updateBlock(block.id, { items: [...(block.props.items || []), { name: 'New Meal', price: '$10.00', image: '' }] })
                          }}
                          className="text-sm bg-[#FFF9E6] text-[#D4AF37] border border-[#E5C158] py-2 rounded-lg flex justify-center items-center gap-1 hover:bg-[#F2D780] hover:text-[#222222] font-semibold transition-colors"
                      ><Plus size={16} strokeWidth={2.5}/> Add Meal Item</button>
                  </div>
                )}
              </div>
            );
          })}
          {blocks.length === 0 && (
             <div className="py-12 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400">
                <p>No blocks added yet.</p>
                <p className="text-sm mt-1">Add a block below to start building.</p>
             </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {Object.entries(BLOCK_REGISTRY).map(([type, registry]) => (
              <button 
                key={type}
                onClick={() => addBlock(type)} 
                className="py-2.5 border border-gray-200 bg-[#FFFFFF] rounded-xl text-[#222222] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#FFF9E6] font-bold text-xs flex flex-col justify-center items-center gap-1 transition-all shadow-sm"
              >
                <Plus size={16} strokeWidth={2.5}/> {registry.label}
              </button>
            ))}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-full lg:w-1/2 bg-[#F2F2F2] rounded-xl border border-gray-200 flex flex-col overflow-hidden hidden lg:flex shadow-inner">
         <div className="bg-[#FFFFFF] border-b border-gray-200 px-5 py-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm text-[#222222] font-bold uppercase tracking-wider">Live Preview</span>
            </div>
            <span className="text-xs text-[#222222] font-medium bg-[#F2F2F2] px-2.5 py-1.5 rounded-md">Updates instantly</span>
         </div>
         <iframe 
            srcDoc={previewHtml}
            className="w-full h-full bg-[#FFFFFF] flex-1 border-none transition-opacity duration-300"
            title="Live Preview"
            sandbox="allow-same-origin"
         />
      </div>
    </div>
  );
}
