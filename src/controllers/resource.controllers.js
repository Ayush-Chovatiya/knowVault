import Resource from "../models/resource.model.js";
import { resourceSchema } from "../validators/resource.validator.js";
import { ZodError } from "zod";

const addResource = async (req, res) => {
  try {
    const validatedData = resourceSchema.parse(req.body);

    const resource = await Resource.create({
      user: req.user.id,
      ...validatedData,
    });

    return res
      .status(201)
      .json({ message: "Resource added successfully", resource });
  } catch (error) {
    if (error instanceof ZodError) {
      const formatted = error.flatten().fieldErrors;
      return res.status(400).json({ message: formatted });
    }

    return res.status(500).json({ message: error.message });
  }
};

const getResource = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const tag = req.query.tag;
    const category = req.query.category;
    const isFav = req.query.isFav;

    const skip = (page - 1) * limit;

    const query = {
      user: req.user.id,
      title: { $regex: search, $options: "i" },
    };

    if (tags) {
      query.tag = tag;
    }

    if (category) {
      query.category = category;
    }

    if (isFav) {
      query.isFav = isFav;
    }

    const resources = await Resource.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Resource.countDocuments(query);

    return res.status(200).json({
      page,
      limit,
      total,
      resources,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSingleResource = async (req, res) => {
  try {
    const resource = await Resource.findOne({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!resource) {
      res.status(400).json({ message: "Resource not found!!" });
    }

    return res
      .status(200)
      .json({ message: "Resource fetched succesfully", resource });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!resource) {
      return res.status(400).json({ message: "Resource not found!!" });
    }

    return res.status(200).json({ message: "Resource deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateResource = async (req, res) => {
  try {
    const { title, link, category, tags, notes, isFav } = req.body;

    const updateFields = {};

    if (title !== undefined) updateFields.title = title;
    if (link !== undefined) updateFields.link = link;
    if (category !== undefined) updateFields.category = category;
    if (tags !== undefined) updateFields.tags = tags;
    if (notes !== undefined) updateFields.notes = notes;
    if (isFav !== undefined) updateFields.isFav = isFav;

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update." });
    }

    const resource = await Resource.findOneAndUpdate(
      {
        user: req.user.id,
        _id: req.params.id,
      },
      {
        $set: updateFields,
      },
      {
        returnDocument: "after",
      },
    );

    if (!resource) {
      return res.status(404).json({ message: "Resource not found!" });
    }

    return res
      .status(200)
      .json({ message: "Resource updated successfully!", resource });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  addResource,
  getResource,
  getSingleResource,
  deleteResource,
  updateResource,
};
