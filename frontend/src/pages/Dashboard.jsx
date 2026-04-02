import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { Layout } from "../components/layout/Layout";
import { ResourceCard } from "../components/resources/ResourceCard";
import { ResourceCardSkeleton } from "../components/resources/ResourceCardSkeleton";
import { ResourceDialog } from "../components/resources/ResourceDialog";
import { EmptyState } from "../components/common/EmptyState";
import { resourceService } from "../services/resourceService";
import { useSnackbar } from "../hooks/useSnackbar";

const CATEGORIES = [
  "all",
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

export function Dashboard() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { showSnackbar } = useSnackbar();

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const data = await resourceService.getAll();
      setResources(data.resources || []);
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to fetch resources",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        !searchQuery ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesCategory =
        categoryFilter === "all" || resource.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [resources, searchQuery, categoryFilter]);

  // Count resources per category
  const categoryCounts = useMemo(() => {
    const counts = { all: resources.length };
    resources.forEach((resource) => {
      const cat = resource.category || "general";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [resources]);

  const handleOpenDialog = (resource = null) => {
    setEditingResource(resource);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingResource(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (data._id) {
        await resourceService.update(data._id, data);
        showSnackbar("Resource updated successfully", "success");
      } else {
        await resourceService.create(data);
        showSnackbar("Resource added successfully", "success");
      }
      fetchResources();
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to save resource",
        "error",
      );
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await resourceService.delete(id);
      setResources((prev) => prev.filter((r) => r._id !== id));
      showSnackbar("Resource deleted successfully", "success");
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to delete resource",
        "error",
      );
    }
  };

  const handleToggleFavorite = async (id, isFav) => {
    try {
      await resourceService.update(id, { isFav });
      setResources((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isFav } : r)),
      );
      showSnackbar(
        isFav ? "Added to favorites" : "Removed from favorites",
        "success",
      );
    } catch (err) {
      showSnackbar("Failed to update favorite status", "error");
    }
  };

  return (
    <Layout>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          My Resources
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Resource
        </Button>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <TextField
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ flex: 1, maxWidth: { md: 400 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ justifyContent: "space-between" }}>
                <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                {categoryFilter !== cat && (
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      ml: 2,
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      bgcolor: "action.hover",
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    {categoryCounts[cat] || 0}
                  </Typography>
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ px: { xs: 0, md: 2 } }}>
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                <ResourceCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Empty State */}
      {!loading && filteredResources.length === 0 && (
        <EmptyState
          title={
            searchQuery || categoryFilter !== "all"
              ? "No matching resources"
              : "No resources yet"
          }
          description={
            searchQuery || categoryFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first resource."
          }
          actionLabel={
            !searchQuery && categoryFilter === "all"
              ? "Add your first resource"
              : undefined
          }
          onAction={
            !searchQuery && categoryFilter === "all"
              ? () => handleOpenDialog()
              : undefined
          }
        />
      )}

      {/* Resources Grid */}
      {!loading && filteredResources.length > 0 && (
        <Box sx={{ px: { xs: 0, md: 2 } }}>
          <Grid container spacing={3}>
            {filteredResources.map((resource) => (
              <Grid item xs={12} sm={6} md={4} xl={3} key={resource._id}>
                <ResourceCard
                  resource={resource}
                  onEdit={handleOpenDialog}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <ResourceDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        resource={editingResource}
      />
    </Layout>
  );
}
