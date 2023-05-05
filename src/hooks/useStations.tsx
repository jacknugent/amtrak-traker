import { useQuery } from "@tanstack/react-query";
import { StationResponse } from "amtrak/dist/types";
import { fetchAllStations } from "amtrak/dist/index";

export default function useStations() {
  return useQuery<StationResponse, Error>(["stations"], fetchAllStations);
}
