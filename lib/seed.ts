import { ID } from "react-native-appwrite";
import { appwriteConfig, storage, tableDB } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[];
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// Ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(tableId: string): Promise<void> {
    const { rows } = await tableDB.listRows(
        appwriteConfig.databaseId,
        tableId,
        []
    );

    await Promise.all(
        rows.map((row) =>
            tableDB.deleteRow(appwriteConfig.databaseId, tableId, row.$id)
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles(appwriteConfig.bucketId);

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile(appwriteConfig.bucketId, file.$id)
        )
    );
}

async function uploadImageToStorage(imageUrl: string) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: blob.type,
        size: blob.size,
        uri: imageUrl,
    };

    const file = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        fileObj
    );

    return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
}

async function seed(): Promise<void> {
    try {
        // 1. Clear all data
        console.log("🗑️ Clearing existing data...");
        await clearAll(appwriteConfig.categoriesId);
        await clearAll(appwriteConfig.customizationsId);
        await clearAll(appwriteConfig.menuId);
        await clearAll(appwriteConfig.menuCustomizationsId);
        await clearStorage();

        // 2. Create Categories
        console.log("📁 Creating categories...");
        const categoryMap: Record<string, string> = {};
        for (const cat of data.categories) {
            const row = await tableDB.createRow(
                appwriteConfig.databaseId,
                appwriteConfig.categoriesId,
                ID.unique(),
                {
                    name: cat.name,
                    description: cat.description,
                }
            );
            categoryMap[cat.name] = row.$id;
        }

        // 3. Create Customizations
        console.log("⚙️ Creating customizations...");
        const customizationMap: Record<string, string> = {};
        for (const cus of data.customizations) {
            const row = await tableDB.createRow(
                appwriteConfig.databaseId,
                appwriteConfig.customizationsId,
                ID.unique(),
                {
                    name: cus.name,
                    price: cus.price,
                    type: cus.type,
                }
            );
            customizationMap[cus.name] = row.$id;
        }

        // 4. Create Menu Items
        console.log("🍕 Creating menu items...");
        const menuMap: Record<string, string> = {};
        for (const item of data.menu) {
            // Upload image and get file ID
            const uploadedImage = await uploadImageToStorage(item.image_url);

            const row = await tableDB.createRow(
                appwriteConfig.databaseId,
                appwriteConfig.menuId,
                ID.unique(),
                {
                    name: item.name,
                    description: item.description,
                    image_url: uploadedImage,
                    price: item.price,
                    rating: item.rating,
                    calories: item.calories,
                    protein: item.protein,
                    categories: categoryMap[item.category_name],
                }
            );

            menuMap[item.name] = row.$id;

            // 5. Create menu_customizations relationships
            console.log(`🔗 Linking customizations for ${item.name}...`);
            for (const cusName of item.customizations) {
                await tableDB.createRow(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCustomizationsId,
                    ID.unique(),
                    {
                        menu: row.$id,
                        customizations: customizationMap[cusName],
                    }
                );
            }
        }

        console.log("✅ Seeding complete!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        throw error;
    }
}

export default seed;