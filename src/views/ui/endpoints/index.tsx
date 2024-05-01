import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { EndpointBaseProps } from "../../../context/props";
import { useTranslation } from "react-i18next";

export const EndpointSelector = ({endpoint, setEndpoint, endpoints, toggleSearch}:
  {
    endpoint: string;
    setEndpoint: (ep: string) => void;
    endpoints: EndpointBaseProps[];
    toggleSearch: (bool: boolean) => void;
  }) => {
  const { t } = useTranslation("views"); 

  // This is a hack. 
  // Don't want to mess with rdt-search-ui and its render methods,
  // as it does not refresh all search stuff on comp rerender.
  // So let's just unmount the component for a fraction, and then remount.
  // Super ugly, but it works.
  const delay = async () => {
    return new Promise((resolve) => 
      setTimeout(resolve, 1));
  };

  const handleSelect = async (e: SelectChangeEvent) => {
    toggleSearch(false);
    await delay();
    setEndpoint(e.target.value);
    toggleSearch(true);
  }

  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h6" sx={{ mr: 2, mb: 0 }}>
        {t("selectDataset")}
      </Typography>
      <FormControl sx={{ width: "20rem" }}>
        <InputLabel id="dataset-select-label">
          {t("dataset")}
        </InputLabel>
        <Select
          labelId="dataset-select-label"
          id="dataset-select"
          value={endpoint}
          label={t("dataset")}
          onChange={handleSelect}
        >
          {endpoints.map((endpoint) => (
            <MenuItem key={endpoint.url} value={endpoint.url}>
              {endpoint.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}