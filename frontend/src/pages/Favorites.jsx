import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { Layout } from "../components/layout/Layout";
import { ResourceCard } from "../components/resources/ResourceCard";
import { ResourceCardSkeleton } from "../components/resources/ResourceCardSkeleton";
import { ResourceDialog } from "../components/resources/ResourceDialog";
import { EmptyState } from "../components/common/EmptyState";
import { resourceService } from "../services/resourceService";
import { useSnackbar } from "../hooks/useSnackbar";

export function Favorites() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { showSnackbar } = useSnackbar();

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const data = await resourceService.getAll();
      const favorites = (data.resources || []).filter((r) => r.isFav);
      setResources(favorites);
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to fetch favorites",
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
    if (!searchQuery) return resources;

    return resources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  }, [resources, searchQuery]);

  const handleOpenDialog = (resource) => {
    setEditingResource(resource);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingResource(null);
  };

  const handleSubmit = async (data) => {
    try {
      await resourceService.update(data._id, data);
      showSnackbar("Resource updated successfully", "success");
      fetchResources();
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to update resource",
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
      if (!isFav) {
        setResources((prev) => prev.filter((r) => r._id !== id));
      }
      showSnackbar("Removed from favorites", "success");
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
          Favorites
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="Search favorites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ maxWidth: 400, width: "100%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Loading State */}
      {loading && (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <ResourceCardSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && filteredResources.length === 0 && (
        <EmptyState
          icon={StarBorderIcon}
          title={searchQuery ? "No matching favorites" : "No favorites yet"}
          description={
            searchQuery
              ? "Try adjusting your search criteria."
              : "Star your favorite resources to see them here."
          }
        />
      )}

      {/* Resources Grid */}
      {!loading && filteredResources.length > 0 && (
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
      )}

      {/* Edit Dialog */}
      <ResourceDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        resource={editingResource}
      />
    </Layout>
  );
}
