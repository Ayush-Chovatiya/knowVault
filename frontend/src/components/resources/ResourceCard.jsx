import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Link,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";

export function ResourceCard({ resource, onEdit, onDelete, onToggleFavorite }) {
  const { _id, title, link, category, tags, notes, isFav } = resource;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      onDelete(_id);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 12px 24px -8px rgba(0,0,0,0.15)"
              : "0 12px 24px -8px rgba(0,0,0,0.4)",
          borderColor: "primary.light",
        },
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          p: 3,
          display: "flex",
          flexDirection: "column",
          "&:last-child": { pb: 3 },
        }}
      >
        {/* Title and Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              mr: 1,
              lineHeight: 1.4,
            }}
          >
            {title}
          </Typography>

          <Box sx={{ display: "flex", gap: 0.25, flexShrink: 0, ml: 1 }}>
            <Tooltip
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <IconButton
                size="small"
                onClick={() => onToggleFavorite(_id, !isFav)}
                sx={{
                  color: isFav ? "warning.main" : "text.secondary",
                  p: 0.5,
                  "&:hover": {
                    color: "warning.main",
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(255, 193, 7, 0.1)"
                        : "rgba(255, 193, 7, 0.15)",
                  },
                }}
              >
                {isFav ? (
                  <StarIcon fontSize="small" />
                ) : (
                  <StarBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(resource)}
                sx={{
                  color: "text.secondary",
                  p: 0.5,
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(92, 107, 192, 0.1)"
                        : "rgba(124, 139, 218, 0.15)",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={handleDelete}
                sx={{
                  color: "text.secondary",
                  p: 0.5,
                  "&:hover": {
                    color: "error.main",
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(244, 67, 54, 0.1)"
                        : "rgba(244, 67, 54, 0.15)",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Link */}
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            color: "primary.main",
            textDecoration: "none",
            fontSize: "0.8125rem",
            mb: 2,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          <Box
            component="span"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {link}
          </Box>
          <OpenInNewIcon sx={{ fontSize: 14, flexShrink: 0 }} />
        </Link>

        {/* Spacer to push category/tags to bottom */}
        <Box sx={{ flex: 1 }} />

        {/* Category */}
        <Box sx={{ mb: tags && tags.length > 0 ? 1.5 : 0 }}>
          <Chip
            label={category || "general"}
            size="small"
            color="primary"
            variant="filled"
            sx={{ fontWeight: 500, fontSize: "0.75rem" }}
          />
        </Box>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
            {tags.slice(0, 4).map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 24 }}
              />
            ))}
            {tags.length > 4 && (
              <Chip
                label={`+${tags.length - 4}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 24 }}
              />
            )}
          </Stack>
        )}

        {/* Notes */}
        {notes && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              fontSize: "0.8125rem",
              lineHeight: 1.5,
            }}
          >
            {notes}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
