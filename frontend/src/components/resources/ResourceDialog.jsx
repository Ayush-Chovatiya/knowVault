import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";

const CATEGORIES = [
  "general",
  "tutorial",
  "documentation",
  "article",
  "video",
  "course",
  "tool",
  "library",
  "other",
];

const initialFormState = {
  title: "",
  link: "",
  category: "general",
  tags: [],
  notes: "",
};

export function ResourceDialog({ open, onClose, onSubmit, resource }) {
  const [form, setForm] = useState(initialFormState);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(resource);

  useEffect(() => {
    if (resource) {
      setForm({
        title: resource.title || "",
        link: resource.link || "",
        category: resource.category || "general",
        tags: resource.tags || [],
        notes: resource.notes || "",
      });
    } else {
      setForm(initialFormState);
    }
    setTagInput("");
  }, [resource, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...form,
        _id: resource?._id,
      });
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(initialFormState);
    setTagInput("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          {isEditMode ? "Edit Resource" : "Add New Resource"}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            fullWidth
            placeholder="Enter resource title"
          />

          <TextField
            label="Link"
            name="link"
            type="url"
            value={form.link}
            onChange={handleChange}
            required
            fullWidth
            placeholder="https://example.com"
          />

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={form.category}
              onChange={handleChange}
              label="Category"
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <TextField
              label="Tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              fullWidth
              placeholder="Press Enter to add a tag"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                ),
              }}
            />
            {form.tags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                {form.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
              </Box>
            )}
          </Box>

          <TextField
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            placeholder="Add any notes about this resource..."
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !form.title || !form.link}
        >
          {loading ? "Saving..." : isEditMode ? "Save Changes" : "Add Resource"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
