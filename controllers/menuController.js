import Menu from "../models/menuModel.js";
import { buildMenuFilter } from "../utilities/menuUtility.js";
import { handleResonse } from "../utilities/userUtility.js";


// 📖 GET ALL ITEMS (with filter)
export const getAllItems = async (req, res) => {
  try {
    const { filter, sort } = buildMenuFilter(req.query);

    const items = await Menu.find(filter).sort(sort);

    return handleResonse(res, 200, "Menu fetched", items);
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};


// 🔍 GET BY ID
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Menu.findById(id);

    if (!item) {
      return handleResonse(res, 404, "Item not found");
    }

    return handleResonse(res, 200, "Item fetched", item);
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};

export const getFilteredMenu = async (req, res) => {
  try {
    const filters = buildMenuFilter(req.query);

    const menuItems = await Menu.find(filters.where)
      .sort(filters.orderBy);

    return handleResonse(res, 200, "Filtered menu", menuItems);

  } catch (error) {
    console.error("Filter error", error);
    return handleResonse(res, 500, "Something went wrong");
  }
};

// ✏️ UPDATE ITEM
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Menu.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: "after" }
    );

    if (!updated) {
      return handleResonse(res, 404, "Item not found");
    }

    return handleResonse(res, 200, "Item updated", updated);
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};


// ❌ SOFT DELETE
export const softDeleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Menu.findByIdAndUpdate(
      id,
      { isAvailable: false },
      { returnDocument: "after" }
    );

    if (!deleted) {
      return handleResonse(res, 404, "Item not found");
    }

    return handleResonse(res, 200, "Item removed");
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};