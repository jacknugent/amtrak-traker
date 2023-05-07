import React from "react";
import { Card, Table } from "react-bootstrap";
import { amtrakCustomFormat, getDisplayStatus } from "../utils/helpers";

interface Train {
  trainID: string;
  trainNum: number;
  routeName: string;
  destName: string;
  origName: string;
  selectedStation: {
    dep: string;
    schDep: string;
    schArr: string;
    status: string;
    depCmnt: string;
    arrCmnt: string;
  };
}

interface TrainTableProps {
  title: "Arrivals" | "Departures";
  stationTrains: Train[];
}

const TrainTable: React.FC<TrainTableProps> = ({ title, stationTrains }) => {
  const isDepartures = title === "Departures";
  const timeKey = isDepartures ? "schDep" : "schArr";
  const commentKey = isDepartures ? "depCmnt" : "arrCmnt";
  const toFrom = isDepartures ? "To" : "From";
  const toFromKey = isDepartures ? "destName" : "origName";

  return (
    <>
      {stationTrains.length > 0 && (
        <>
          <Card.Title>{title}</Card.Title>
          <Table striped bordered hover responsive="md">
            <thead>
              <tr>
                <th>Time</th>
                <th>No.</th>
                <th className="d-none d-sm-table-cell">Train</th>
                <th>{toFrom}</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stationTrains.map((t) => (
                <tr key={t.trainID}>
                  <td>
                    {amtrakCustomFormat(new Date(t.selectedStation[timeKey]))}
                  </td>
                  <td>{t.trainNum}</td>
                  <td className="d-none d-sm-table-cell">{t.routeName}</td>
                  <td>{t[toFromKey]}</td>
                  <td>
                    {getDisplayStatus(
                      t.selectedStation.status,
                      t.selectedStation[commentKey],
                      t.selectedStation[timeKey]
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default TrainTable;
