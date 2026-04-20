import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

// Define the structure of a lost item
interface LostItem {
    id: string;
    image_path: string;
    category: string;
    place: string;
    image_url: string;
    created_at: string;
}

function LostFound() {
    const [items, setItems] = useState<LostItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filterCategory, setFilterCategory] = useState<string>("");
    const [filterPlace, setFilterPlace] = useState<string>("");
    const navigate = useNavigate();

    // Get unique categories and places from items
    const categories = Array.from(new Set(items.map(item => item.category))).sort();
    const places = Array.from(new Set(items.map(item => item.place))).sort();

    // Filter items based on selected filters
    const filteredItems = items.filter(item => {
        const categoryMatch = !filterCategory || item.category === filterCategory;
        const placeMatch = !filterPlace || item.place === filterPlace;
        return categoryMatch && placeMatch;
    });

    // Check authentication and fetch items on component mount
    useEffect(() => {
        checkAuth();
        fetchItems();
    }, []);

    // Function to check if the user is authenticated
    const checkAuth = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (!data.session || error) {
            navigate('/login');
        }
    };

    // Function to handle user sign out
    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/login');
        } catch (error: any) {
            alert('Error signing out: ' + error.message);
        }
    };

    // Function to fetch lost items from the database
    const fetchItems = async () => {
        try {
            setLoading(true);

            // Fetch from database
            const { data, error } = await supabase
                .from('lost_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            // Get public URLs for each image
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
            alert("Could not load items");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#e6e2c5] text-[#3d348b] min-h-screen p-10">
            <div className="flex justify-between items-center mb-10">
                <div className="flex justify-center md:text-[50px] text-[30px] font-bold text-[#2b4593] flex-1">
                    <p className="tracking-[10px]">LOST & FOUND</p>
                </div>
                <button
                    onClick={handleSignOut}
                    className="bg-[#2b4593] text-[#e6e2c5] font-bold rounded-[5px] px-6 py-3 hover:bg-[#3d348b] transition-colors"
                >
                    Sign Out
                </button>
            </div>

            {loading ? (
                <div className="text-center text-xl font-bold">Loading items...</div>
            ) : (
                <>
                    {/* Filter Section */}
                    <div className="mb-8 bg-[#e6d3b3] border-[4px] border-[#2b4593] rounded-[8px] p-6">
                        <h3 className="text-xl font-bold text-[#2b4593] mb-4">Filter Items</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Category Filter */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#2b4593]">Category</label>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="p-2 rounded-[5px] text-black font-medium outline-none"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Place Filter */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#2b4593]">Place</label>
                                <select
                                    value={filterPlace}
                                    onChange={(e) => setFilterPlace(e.target.value)}
                                    className="p-2 rounded-[5px] text-black font-medium outline-none"
                                >
                                    <option value="">All Places</option>
                                    {places.map((place) => (
                                        <option key={place} value={place}>{place}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Items Grid */}
                    {filteredItems.length === 0 ? (
                        <div className="text-center text-xl">No items match your filters.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="bg-[#e6d3b3] border-[4px] border-[#2b4593] rounded-[8px] p-3 flex flex-col">
                                    <img 
                                        src={item.image_url} 
                                        alt={item.category} 
                                        className="w-full h-48 object-cover rounded-[4px] mb-3"
                                    />
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-[#2b4593]">Category</p>
                                            <p className="text-base font-bold">{item.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#2b4593]">Place</p>
                                            <p className="text-base font-bold">{item.place}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default LostFound;