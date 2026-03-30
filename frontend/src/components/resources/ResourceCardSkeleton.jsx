import { Card, CardContent, Skeleton, Box, Stack } from "@mui/material";

export function ResourceCardSkeleton() {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Title row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Skeleton variant="text" width="60%" height={28} />
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="circular" width={28} height={28} />
          </Box>
        </Box>

        {/* Link */}
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />

        {/* Category chip */}
        <Skeleton variant="rounded" width={80} height={24} sx={{ mb: 2 }} />

        {/* Tags */}
        <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
          <Skeleton variant="rounded" width={60} height={22} />
          <Skeleton variant="rounded" width={50} height={22} />
          <Skeleton variant="rounded" width={70} height={22} />
        </Stack>

        {/* Notes */}
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="85%" height={20} />
      </CardContent>
    </Card>
  );
}
