import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

// Define the LostItem interface to represent the structure of lost items in the database
interface LostItem {
    id: string;
    image_path: string;
    category: string;
    place: string;
    image_url: string;
    created_at: string;
}

function Admin() {
    // State variables for managing form inputs, loading states, and user authentication
    const [uploading, setUploading] = useState(false);
    const [category, setCategory] = useState("");
    const [place, setPlace] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [items, setItems] = useState<LostItem[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    // Predefined categories and places for dropdown selection
    const categories = [
        "Electronics",
        "Jewelry",
        "Water Bottle",
        "Stationery",
        "Books",
        "Sports Equipment",
        "Clothing",
        "Other"
    ];

    const places = [
        "Gould",
        "Mitchell",
        "Library",
        "MKSC",
        "Woods",
        "Suna Kıraç",
        "Gym",
        "Bingham"
    ];

    // useEffect to check user authentication and fetch lost items
    useEffect(() => {
        checkAuth();
        fetchItems();
    }, []);

    // Function to check if the user is authenticated
    const checkAuth = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (!data.session || error) {
            navigate('/login');
        } else {
            setUser(data.session.user);
        }
    };

    // Function to handle user sign out
    const fetchItems = async () => {
        try {
            setLoadingItems(true);
            const { data, error } = await supabase
                .from('lost_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            // Map through the fetched items to get their public URLs from storage
            const itemsWithUrls = data?.map((item) => {
                const { data: publicUrlData } = supabase.storage
                    .from('Lost Items')
                    .getPublicUrl(item.image_path);
                
                return {
                    ...item,
                    image_url: publicUrlData.publicUrl
                };
            }) || [];

            setItems(itemsWithUrls);
        } catch (error: any) {
            console.error("Error fetching items:", error.message);
        } finally {
            setLoadingItems(false);
        }
    };

    // Function to handle deletion of an item (marking it as found)
    const handleDeleteItem = async (itemId: string, imagePath: string) => {
        try {
            setDeletingId(itemId);

            const { error: dbError } = await supabase
                .from('lost_items')
                .delete()
                .eq('id', itemId);

            if (dbError) {
                throw dbError;
            }

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from('Lost Items')
                .remove([imagePath]);

            if (storageError) {
                throw storageError;
            }

            alert('Item marked as found and removed!');
            fetchItems();
        } catch (error: any) {
            alert('Error removing item: ' + error.message);
        } finally {
            setDeletingId(null);
        }
    };

    // Function to handle file selection for upload
    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    // Function to handle the upload of a new lost item
    const handleUpload = async () => {
        try {
            setUploading(true);
            
            if (!selectedFile) {
                throw new Error('You must select an image to upload.');
            }

            if (!category || !place) {
                throw new Error('Please select both category and place.');
            }

            const folderName = "Lost Items"; 
            
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${folderName}/${fileName}`;

            const { data: storageData, error: storageError } = await supabase.storage
                .from('Lost Items')
                .upload(filePath, selectedFile);

            if (storageError) {
                throw storageError;
            }

            // Store metadata in database
            const { error: dbError } = await supabase
                .from('lost_items')
                .insert([
                    {
                        image_path: filePath,
                        category: category,
                        place: place,
                        uploaded_by: user?.id,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (dbError) {
                throw dbError;
            }

            alert('Item uploaded successfully!');
            console.log('Uploaded:', storageData);
            
            // Reset form
            setCategory("");
            setPlace("");
            setSelectedFile(null);
            
            // Refresh items list
            fetchItems();
            
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-[#e6e2c5] text-[#3d348b] min-h-screen p-10">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <div className="bg-[#e6d3b3] text-[#2b4593] font-bold border-[8px] border-[#2b4593] rounded-[8px] p-10 w-full">
                        <h2 className="text-3xl mb-8 font-bold text-center">Report Lost Item</h2>
                        {/* Form for uploading a new lost item */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-lg font-semibold">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    disabled={uploading}
                                    className="p-3 rounded-[5px] text-black font-medium outline-none"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Place Dropdown */}
                            <div className="flex flex-col gap-2">
                                <label className="text-lg font-semibold">Place</label>
                                <select
                                    value={place}
                                    onChange={(e) => setPlace(e.target.value)}
                                    disabled={uploading}
                                    className="p-3 rounded-[5px] text-black font-medium outline-none"
                                >
                                    <option value="">Select a place</option>
                                    {places.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            {/* File Upload */}
                            <div className="flex flex-col gap-2">
                                <label className="text-lg font-semibold">Upload Image</label>
                                <input 
                                    type="file" 
                                    onChange={handleFileSelect} 
                                    disabled={uploading}
                                    accept="image/*"
                                    className="p-3 rounded-[5px] text-black font-medium"
                                />
                                {selectedFile && <p className="text-sm text-[#2b4593] font-semibold">Selected: {selectedFile.name}</p>}
                            </div>
                            {/* Upload Button */}
                            <button
                                onClick={handleUpload}
                                disabled={uploading || !selectedFile || !category || !place}
                                className={`w-full p-3 rounded-[5px] font-bold text-lg transition-colors ${
                                    uploading || !selectedFile || !category || !place
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-[#2b4593] text-[#e6e2c5] hover:bg-[#3d348b]'
                                }`}
                            >
                                {uploading ? 'Uploading...' : 'Upload Item'}
                            </button>

                            {uploading && <p className="text-center text-yellow-600 font-semibold">Processing...</p>}
                        </div>
                    </div>
                </div>

                {/* Items Management Section */}
                <div>
                    <div className="bg-[#e6d3b3] text-[#2b4593] font-bold border-[8px] border-[#2b4593] rounded-[8px] p-10 w-full">
                        <h2 className="text-3xl mb-8 font-bold text-center">Manage Lost Items (Mark as Found)</h2>
                        
                        {loadingItems ? (
                            <div className="text-center text-xl font-bold">Loading items...</div>
                        ) : items.length === 0 ? (
                            <div className="text-center text-xl">No items to manage.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-white border-[4px] border-[#2b4593] rounded-[8px] p-4 flex flex-col">
                                        <img 
                                            src={item.image_url} 
                                            alt={item.category} 
                                            className="w-full h-40 object-cover rounded-[4px] mb-3"
                                        />
                                        <div className="flex-1 flex flex-col gap-2 mb-4">
                                            <div>
                                                <p className="text-sm font-semibold text-[#2b4593]">Category</p>
                                                <p className="text-base font-bold">{item.category}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#2b4593]">Place</p>
                                                <p className="text-base font-bold">{item.place}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(item.id, item.image_path)}
                                            disabled={deletingId === item.id}
                                            className={`w-full p-2 rounded-[5px] font-bold transition-colors ${
                                                deletingId === item.id
                                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                    : 'bg-red-500 text-white hover:bg-red-600'
                                            }`}
                                        >
                                            {deletingId === item.id ? 'Removing...' : 'Mark as Found'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin;