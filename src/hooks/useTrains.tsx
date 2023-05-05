import { useQuery } from "@tanstack/react-query";
import { TrainResponse } from "amtrak/dist/types";
import { fetchAllTrains } from "amtrak/dist/index";

export default function useTrains() {
  return useQuery<TrainResponse, Error>(["trains"], fetchAllTrains, {
    refetchInterval: 30000,
  });
}
