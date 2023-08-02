import { Card, Button } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

export const Cards = ({
  registros,
  filter,
  onAcceptMaintenance,
  onDenyMaintenance,
}) => {
  return (
    <ul className="bg-gray-800 shadow-md rounded px-8 py-6 pb-8 mb-4">
      {registros.map((registro) => (
        <Card
          className="bg-gray-600 w-full flex items-center top-2 px-1 py-1 pb-1 mb-1"
          key={registro.id}
          style={{ marginBottom: "20px" }}
        >
          <h1 className="text-white font-bold text-lg">
            <strong>Servicio: </strong>
            {registro.servicio}
          </h1>
          <p className="text-sm text-white">
            <strong> {registro.comentario} </strong>
            <br />
            <strong>Placa: {registro.placamoto} </strong>
          </p>
          {registro.state !== "aceptado" && registro.state !== "negado" && (
            <>
              {filter !== "" && (
                <>
                  <div className="flex justify-between">
                    <Button
                      className="text-white bg-green-400 px-3 py-1 rounded-md mr-auto"
                      onClick={() => onAcceptMaintenance(registro.id)}
                    >
                      <CheckOutlined />
                    </Button>
                    <Button
                      className="text-white bg-red-400 px-3 py-1 rounded-md ml-auto"
                      onClick={() => onDenyMaintenance(registro.id)}
                    >
                      <CloseOutlined />
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </Card>
      ))}
    </ul>
  );
};
