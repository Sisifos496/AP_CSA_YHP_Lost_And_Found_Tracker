import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function LostFound() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const folderName = 'Lost Items';

            const { data, error } = await supabase.storage
                .from('Lost Items')
                .list(folderName, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' },
                });

            if (error) {
                throw error;
            }

            const validFiles = data?.filter((file) => file.name !== '.emptyFolderPlaceholder') || [];

            const urls = validFiles.map((file) => {
                const { data: publicUrlData } = supabase.storage
                    .from('Lost Items')
                    .getPublicUrl(`${folderName}/${file.name}`);
                
                return publicUrlData.publicUrl;
            });

            setImageUrls(urls);

        } catch (error: any) {
            console.error("Error fetching images:", error.message);
            alert("Could not load images.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#e6e2c5] text-[#3d348b] min-h-screen p-10">
            <div className="flex justify-center md:text-[50px] text-[30px] font-bold text-[#2b4593] mb-10">
                <p className="tracking-[10px]">LOST & FOUND</p>
            </div>

            {loading ? (
                <div className="text-center text-xl font-bold">Loading items...</div>
            ) : imageUrls.length === 0 ? (
                <div className="text-center text-xl">No lost items reported yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {imageUrls.map((url, index) => (
                        <div key={index} className="bg-[#e6d3b3] border-[4px] border-[#2b4593] rounded-[8px] p-2 flex flex-col items-center">
                            <img 
                                src={url} 
                                alt={`Lost item ${index}`} 
                                className="w-full h-48 object-cover rounded-[4px]"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LostFound;