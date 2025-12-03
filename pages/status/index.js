/* eslint-disable react-hooks/rules-of-hooks */
import useSWR from "swr";

async function fetchStatus(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function statusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdateAt />
      <h1>Database</h1>
      <DatabaseInfo />
    </>
  );
}

function UpdateAt() {
  const { isLoading, data } = useSWR("api/v1/status", fetchStatus, {
    refreshInterval: 2000,
  });

  return (
    <>
      {isLoading && data?.updated_at ? (
        <p>carregando...</p>
      ) : (
        <div>
          Ultima atualização:{" "}
          {new Date(data?.updated_at).toLocaleString("pt-BR")}
        </div>
      )}
    </>
  );
}

function DatabaseInfo() {
  const { isLoading, data } = useSWR("api/v1/status", fetchStatus, {
    refreshInterval: 2000,
  });

  return (
    <>
      {isLoading && data ? (
        <p>carregando...</p>
      ) : (
        <div>
          Versão do banco de dados:{data?.dependencies?.database?.version}
          <br></br>
          Conexão maxima:
          {data?.dependencies?.database?.max_connections}
          <br></br>
          Quantidade de conexões:
          {data?.dependencies?.database?.opened_connections}
        </div>
      )}
    </>
  );
}
