import { useMemo, useState } from "react";
import { useSessionStorage, useStations, useTrains } from "../hooks";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Train } from "amtrak/dist/types";
import TrainTable from "./TrainTable";
import dayjs from "dayjs";
import ConditionalSpinner from "./LoadingSpinner";
import { filterSortTrainsByTimeRange, flatten } from "../utils/helpers";

export default function Trains() {
  const { data: stations, isLoading, isError } = useStations();
  const {
    data: trains,
    dataUpdatedAt,
    isLoading: isTrainsLoading,
    isError: isTrainsError,
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

  const departureTrains = useMemo(() => {
    return filterSortTrainsByTimeRange(stationTrains, "Departure", 1, 3, 11);
  }, [stationTrains]);

  const arrivalTrains = useMemo(() => {
    return filterSortTrainsByTimeRange(stationTrains, "Arrival", 1, 3, 11);
  }, [stationTrains]);

  const selectStation = (station: string) => {
    setSearchValue("");
    setSelectedStation(station);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between">
        <div>
          <h1 className="mt-2">Amtraker</h1>
          <p className="mb-1">To view live Amtrak train information</p>
        </div>
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
                      className="text-start"
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
      {(isError || isTrainsError) && (
        <div>An error occured while trying to fetch Amtrak data.</div>
      )}
      {station && (
        <Card className="mb-2">
          <Card.Body className="pb-0">
            <Card.Title className="mb-3 d-flex justify-content-between">
              <strong>{station?.name} Station</strong>
            </Card.Title>
            <TrainTable title="Departures" stationTrains={departureTrains} />
            <TrainTable title="Arrivals" stationTrains={arrivalTrains} />
            {!isTrainsLoading &&
              departureTrains.length === 0 &&
              arrivalTrains.length === 0 && (
                <p>No upcoming trains scheduled.</p>
              )}
            {!isTrainsLoading && (
              <div className="mb-3">
                Last Updated: {dayjs(dataUpdatedAt).format("h:mma")}
              </div>
            )}
          </Card.Body>
        </Card>
      )}
      <p className="mt-3">
        This website is experimental and has no relation to Amtrak.
      </p>
      <p>
        Suggestions? Share them on{" "}
        <a href="https://github.com/jacknugent/amtrak-traker/issues/new">
          Github
        </a>
        .
      </p>
    </Container>
  );
}
