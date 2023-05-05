import { useMemo, useState } from "react";
import { useSessionStorage, useStations, useTrains } from "../hooks";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Train } from "amtrak/dist/types";
import TrainTable from "./TrainTable";
import dayjs from "dayjs";
import ConditionalSpinner from "./LoadingSpinner";
import {
  filterAndSortTrainsByScheduledTimeRange,
  flatten,
} from "../utils/helpers";

export default function Trains() {
  const { data: stations, isLoading } = useStations();
  const {
    data: trains,
    dataUpdatedAt,
    isLoading: isTrainsLoading,
  } = useTrains();
  const [searchValue, setSearchValue] = useState("");
  const [selectedStation, setSelectedStation] = useSessionStorage(
    "selectedStation",
    ""
  );

  const filteredStations = useMemo(
    () =>
      Object.values(stations ?? {}).filter((s) => {
        const search = searchValue.toLowerCase();
        return (
          s.name.toLowerCase().includes(search) ||
          s.city.toLowerCase().includes(search) ||
          s.code.toLowerCase().includes(search) ||
          s.state.toLowerCase().includes(search)
        );
      }),
    [stations, searchValue]
  );

  const station = stations && stations[selectedStation];
  const allTrains = flatten<Train>(Object.values(trains ?? []) ?? []);

  const stationTrains = useMemo(
    () =>
      allTrains
        .filter((train) => station?.trains?.includes(train.trainID))
        .map((train) => ({
          ...train,
          selectedStation: train.stations.find(
            (station) => station.code === selectedStation
          )!,
        })),
    [allTrains]
  );

  const departureTrains = filterAndSortTrainsByScheduledTimeRange(
    stationTrains,
    "Departure"
  );
  const arrivalTrains = filterAndSortTrainsByScheduledTimeRange(
    stationTrains,
    "Arrival"
  );

  const selectStation = (station: string) => {
    setSearchValue("");
    setSelectedStation(station);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between">
        <h1 className="mt-2">Amtrak Traker</h1>
        <div className="mt-2 me-2">
          <ConditionalSpinner when={isLoading || isTrainsLoading} />
        </div>
      </div>
      <Card className="mt-3 mb-3">
        <Card.Body>
          <Form>
            <Row className="position-relative">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Search for your station:</Form.Label>
                  <Form.Control
                    placeholder="Search by name, city, or code"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    disabled={isLoading}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-2">
              {searchValue &&
                filteredStations.slice(0, 3).map((s) => (
                  <div key={s.code} className="mb-1">
                    <Button
                      variant="light"
                      onClick={() => selectStation(s.code)}
                    >
                      {s.name} Station - {s.city}, {s.state}
                    </Button>
                  </div>
                ))}
            </Row>
          </Form>
        </Card.Body>
      </Card>
      {station && (
        <Card className="mb-2">
          <Card.Body>
            <Card.Title className="mb-4 d-flex justify-content-between">
              <strong>{station?.name} Station</strong>
            </Card.Title>
            <TrainTable title="Departures" stationTrains={departureTrains} />
            <TrainTable title="Arrivals" stationTrains={arrivalTrains} />
            {!isTrainsLoading &&
              departureTrains.length === 0 &&
              arrivalTrains.length === 0 && (
                <p>No trains listed in the next three hours.</p>
              )}
            {!isTrainsLoading && (
              <div>Last Updated: {dayjs(dataUpdatedAt).format("h:mma")}</div>
            )}
          </Card.Body>
        </Card>
      )}
      <p className="mt-3">
        This website is experimental and not associated with Amtrak. Use at your
        own risk.
      </p>
    </Container>
  );
}
