import { Router } from "express";
import { supabase } from "../supabase.mjs";

const Router = Router();

// get /inventory : fetchs all inventory items, ordered alphabetically.


router.get("/", async (_req, res) => {
    const { data, error }= await supabase
    .from("items")
    .select("*")
    .order("name", {ascending: true});

    if (error) return res.stauts(500).json ({ error:error.message}); 
    res.json(data);
});

// adds a new item into the items table/list

router.post("/", async (req, res)=> {
    const { name, type, quantity } = req.body || {};

    // basic input validation
    if (!name || !type || typeof quantity !== "number") {
        return res.stauts(400).json ({ error: "name, type, and quantitiy are required "});
    }

    // insert into supabase 
    const { data, error } = await supabase
    .from("items")
    .insert([{ name, type, quantity}])
    .select();

    if (error) return res.status(500).json ({error: error.message});
    res.status(201).json(data[0]);
});

// inventory request 
// decremtns item stocks and logs the request

router.post("/request", async (req, res) => {
    const { itemId, qty, worksite } = req.body || {};

    // validate input 
    if (!itemId || typeof qty !== "number") {
        return res.status(400).json({error: "itemID and qty are required"});
    }

    // fetch the item 
    const { data: item, error: findError} = await supabase
    .from("items")
    .select("*")
    .eq("id", itemId)
    .single();

    if (findError) return res.status(500).json({ error :findError.message});
    if (!item) return res.status(404).json({ error: "Item not found"});
    if (item.quantity < qty) return res.status(409).json ({ error :"Insufficient stock"});


    // Update the quantity (decrement)
    const newQty = item.quantity - qty;
    const {error: updateError } = await supabase
    .from("items")
    .update ({ quantity:newQty })
    .eq("id, itemId");

    if (updateError) return res.status(500).json ({ error: updateError.message });

    // Log the request 
    await supabase.from("requests").insert([{ item_id : itemId, qty, worksite}]);
    
    res.json({ message: "Request Processed", remaining: newQty });

});

export default router;
