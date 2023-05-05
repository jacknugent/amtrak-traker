import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { StationResponse } from "amtrak/dist/types";
import { fetchStation } from "amtrak/dist/index";

export default function useStation(
  id: string | null
): UseQueryResult<StationResponse, Error> {
  return useQuery(["trains", id], () => fetchStation(id as string), {
    enabled: id !== null,
  });
}
