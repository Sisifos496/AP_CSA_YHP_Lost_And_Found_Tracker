import { useState, ChangeEvent } from "react";
import { supabase } from "../supabaseClient";

function Admin() {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            
            const folderName = "Lost Items"; 
            
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${folderName}/${fileName}`;

            const { data, error } = await supabase.storage
                .from('Lost Items')
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            alert('File uploaded to folder successfully!');
            console.log('Uploaded:', data);
            
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="bg-[#e6e2c5] text-[#3d348b] h-screen p-10">
            <h2 className="text-2xl mb-4 font-bold">Upload to Folder</h2>
            <input type="file" onChange={handleUpload} disabled={uploading} />
        </div>
    )
}

export default Admin;