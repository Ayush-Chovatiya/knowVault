import { Box, Typography, Button } from "@mui/material";
import { Inventory as InventoryIcon } from "@mui/icons-material";

export function EmptyState({
  icon: Icon = InventoryIcon,
  title = "No items found",
  description = "Get started by adding your first item.",
  actionLabel,
  onAction,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 3,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Icon sx={{ fontSize: 40, color: "text.secondary" }} />
      </Box>

      <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
        {title}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400 }}
      >
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
