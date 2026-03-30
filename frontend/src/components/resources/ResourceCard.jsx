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
  const { _id, title, link, category, tags, notes, isFavorite } = resource;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      onDelete(_id);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <CardContent sx={{ flex: 1, p: 3 }}>
        {/* Title and Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              mr: 1,
            }}
          >
            {title}
          </Typography>

          <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
            <Tooltip
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <IconButton
                size="small"
                onClick={() => onToggleFavorite(_id, !isFavorite)}
                sx={{
                  color: isFavorite ? "warning.main" : "text.secondary",
                  "&:hover": {
                    color: "warning.main",
                    bgcolor: "warning.main",
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(255, 193, 7, 0.1)"
                        : "rgba(255, 193, 7, 0.15)",
                  },
                }}
              >
                {isFavorite ? (
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
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "primary.main",
            textDecoration: "none",
            fontSize: "0.875rem",
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {link}
          <OpenInNewIcon sx={{ fontSize: 14 }} />
        </Link>

        {/* Category */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={category || "general"}
            size="small"
            color="primary"
            variant="filled"
          />
        </Box>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
          >
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            ))}
          </Stack>
        )}

        {/* Notes */}
        {notes && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {notes}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
