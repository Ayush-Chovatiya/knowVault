import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { Layout } from "../components/layout/Layout";
import { resourceService } from "../services/resourceService";
import { useSnackbar } from "../hooks/useSnackbar";

export function Categories() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const categoryCounts = useMemo(() => {
    const counts = {};
    resources.forEach((resource) => {
      const category = resource.category || "general";
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  }, [resources]);

  const filteredCategories = useMemo(() => {
    const categories = Object.entries(categoryCounts);

    if (!searchQuery) return categories;

    return categories.filter(([category]) =>
      category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [categoryCounts, searchQuery]);

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
          Categories
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="Search categories..."
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

      {/* Categories Grid */}
      {!loading && (
        <Grid container spacing={3}>
          {filteredCategories.map(([category, count]) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={category}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <CategoryIcon sx={{ color: "white", fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Typography>
                  <Chip
                    label={`${count} resource${count !== 1 ? "s" : ""}`}
                    size="small"
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && filteredCategories.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            textAlign: "center",
          }}
        >
          <CategoryIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
            No categories found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {searchQuery
              ? "Try adjusting your search criteria."
              : "Add resources to see categories here."}
          </Typography>
        </Box>
      )}
    </Layout>
  );
}
